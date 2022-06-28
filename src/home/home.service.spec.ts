import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { homeSelect, HomeService } from './home.service';

const mockGetHomes = [
  {
    id: 8,
    address: 'Rua 3',
    city: 'Toronnto',
    price: 123000,
    image:
      'https://mss-p-022-delivery.stylelabs.cloud/api/public/content/010c4a1acf884ac99b179b195da8f447?v=c6c21998',
    property_type: 'CONDO',
    number_of_bedrooms: 4,
    number_of_bathrooms: 3,
    images: [{ url: 'src1' }],
  },
  {
    id: 9,
    address: 'Rua 3',
    city: 'Toronnto',
    price: 123000,
    image:
      'https://mss-p-022-delivery.stylelabs.cloud/api/public/content/010c4a1acf884ac99b179b195da8f447?v=c6c21998',
    property_type: 'CONDO',
    number_of_bedrooms: 4,
    number_of_bathrooms: 3,
    images: [{ url: 'src1' }],
  },
];

const mockHome = {
  id: 9,
  address: 'Rua 3',
  city: 'Toronnto',
  price: 123000,
  image:
    'https://mss-p-022-delivery.stylelabs.cloud/api/public/content/010c4a1acf884ac99b179b195da8f447?v=c6c21998',
  property_type: 'CONDO',
  number_of_bedrooms: 4,
  number_of_bathrooms: 3,
};

const mockImages = [
  {
    id: 1,
    url: 'src1',
  },
  {
    id: 2,
    url: 'src2',
  },
];

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockGetHomes),
              create: jest.fn().mockReturnValue(mockHome),
            },
            image: {
              createMany: jest.fn().mockReturnValue(mockImages),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHomes', () => {
    const filters = {
      city: 'Toronnto',
      proce: {
        gte: 1000,
        lte: 1000000,
      },
      propertyType: PropertyType.CONDO,
    };

    it('Should call prisma home.findMany with correct params', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);
      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await service.getHomes(filters);
      expect(mockPrismaFindManyHomes).toBeCalledWith({
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
    });

    it('should throw not found exception if no homes are found', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue([]);
      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await expect(service.getHomes(filters)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('createMany', () => {
    const mockCreateHomeParams = {
      address: 'rua exemplo 1',
      numberOfBathrooms: 1,
      numberOfBedrooms: 1,
      city: 'Toronnto',
      propertyType: PropertyType.CONDO,
      price: 1111,
      landSize: 10,
      images: [{ url: 'src1' }],
    };

    it('should call prisma home.create with correct params', async () => {
      const mockCreateHome = jest.fn().mockReturnValue(mockHome);
      jest
        .spyOn(prismaService.home, 'create')
        .mockImplementation(mockCreateHome);

      await service.createHome(mockCreateHomeParams, 1);

      expect(mockCreateHome).toBeCalledWith({
        data: {
          address: 'rua exemplo 1',
          number_of_bathrooms: 1,
          number_of_bedrooms: 1,
          city: 'Toronnto',
          price: 1111,
          land_size: 10,
          property_type: PropertyType.CONDO,
          realtor_id: 1,
        },
      });
    });

    it('should call prisma home.createMany with correct params', async () => {
      const mockCreateManyImage = jest.fn().mockReturnValue(mockImages);
      jest
        .spyOn(prismaService.image, 'createMany')
        .mockImplementation(mockCreateManyImage);

      await service.createHome(mockCreateHomeParams, 1);
      expect(mockCreateManyImage).toBeCalledWith({
        data: [{ url: 'src1', home_id: 9 }],
      });
    });
  });
});
