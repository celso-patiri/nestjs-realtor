import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DecodedUser } from 'src/user/decorators/user.decorator';
import { HomeResponseDTO, Image } from './dtos/home.dto';

interface GetHomesParams {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}

interface CreateHomeParams {
  address: string;
  numberOfBathrooms: number;
  numberOfBedrooms: number;
  city: string;
  price: number;
  landSize: number;
  propertyType: PropertyType;
  images: Image[];
}

interface UpdateHomeParams {
  address?: string;
  numberOfBathrooms?: number;
  numberOfBedrooms?: number;
  city?: string;
  price?: number;
  landSize?: number;
  propertyType?: PropertyType;
}

export const homeSelect = {
  id: true,
  address: true,
  city: true,
  price: true,
  property_type: true,
  number_of_bathrooms: true,
  number_of_bedrooms: true,
};

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filters: GetHomesParams): Promise<HomeResponseDTO[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        ...homeSelect,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: filters,
    });

    if (!homes.length) throw new NotFoundException();

    return homes.map((home) => {
      const fetchedHome = { ...home, image: home.images[0].url };
      delete fetchedHome.images;
      return new HomeResponseDTO(fetchedHome);
    });
  }

  async getHomeById(id: number) {
    const home = await this.prismaService.home.findUnique({ where: { id } });
    if (!home) throw new NotFoundException();
    return new HomeResponseDTO(home);
  }

  async createHome(homeData: CreateHomeParams, userId: number) {
    const {
      address,
      numberOfBathrooms,
      numberOfBedrooms,
      city,
      propertyType,
      price,
      landSize,
      images,
    } = homeData;

    const home = await this.prismaService.home.create({
      data: {
        address,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        city,
        price,
        land_size: landSize,
        property_type: propertyType,
        realtor_id: userId,
      },
    });

    const homeImages = images.map((image) => {
      return { ...image, home_id: home.id };
    });

    await this.prismaService.image.createMany({ data: homeImages });

    return new HomeResponseDTO(home);
  }

  async updateHomeById(id: number, data: UpdateHomeParams) {
    const home = await this.prismaService.home.findUnique({ where: { id } });

    if (!home) throw new NotFoundException();

    const updatedHome = await this.prismaService.home.update({
      where: { id },
      data,
    });

    return new HomeResponseDTO(updatedHome);
  }

  async deleteHomeById(id: number) {
    const homeExists = await this.prismaService.home.findUnique({
      where: { id },
    });
    if (!homeExists) throw new NotFoundException();

    await this.prismaService.image.deleteMany({ where: { home_id: id } });
    await this.prismaService.home.delete({ where: { id } });
  }

  async getRealterByHomeId(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: { id },
      select: {
        realtor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    if (!home) throw new NotFoundException();
    return home.realtor;
  }

  async inquire(buyer: DecodedUser, homeId: number, message: string) {
    const realtor = await this.getRealterByHomeId(homeId);
    return this.prismaService.message.create({
      data: {
        realtor_id: realtor.id,
        buyer_id: buyer.id,
        home_id: homeId,
        message,
      },
    });
  }

  async getMessagesByHome(homeId: number) {
    return this.prismaService.message.findMany({
      where: {
        home_id: homeId,
      },
      select: {
        message: true,
        buyer: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });
  }
}
