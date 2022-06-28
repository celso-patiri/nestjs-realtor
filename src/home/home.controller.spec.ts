import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

const mockRealtor = {
  id: 8,
  name: 'Celso',
  email: 'teste@test.com',
  phone: '555 555 5555',
};

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

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            getHomes: jest.fn().mockReturnValue([]),
            getHomesByRealtorId: jest.fn().mockReturnValue(mockRealtor),
            updateHomeById: jest.fn().mockReturnValue(mockHome),
            getRealterByHomeId: jest.fn().mockReturnValue({ id: 8 }),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHomes', () => {
    it('should construct filter object correctly', async () => {
      const mockGetHomes = jest.fn().mockReturnValue([]);
      jest.spyOn(homeService, 'getHomes').mockImplementation(mockGetHomes);
      await controller.getHomes('Toronto', '1000');

      expect(mockGetHomes).toBeCalledWith({
        city: 'Toronto',
        price: {
          gte: 1000,
        },
      });
    });
  });

  describe('updateHome', () => {
    const mockUpdateHomeParams = {
      address: 'rua exemplo 1',
      numberOfBathrooms: 1,
      numberOfBedrooms: 1,
      city: 'Toronnto',
      propertyType: PropertyType.CONDO,
      price: 1111,
      landSize: 10,
      images: [{ url: 'src1' }],
    };

    const mockUserInfo = {
      name: 'Celso',
      id: 30,
      iat: 1,
      exp: 1,
    };

    it('Should throw unauth error if realtor didnt create home', async () => {
      await expect(
        controller.updateHome(1, mockUpdateHomeParams, mockUserInfo),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('Should update home if realtor_id is valid', async () => {
      const mockUpdateHome = jest.fn().mockReturnValue(mockHome);
      jest
        .spyOn(homeService, 'updateHomeById')
        .mockImplementation(mockUpdateHome);

      await controller.updateHome(1, mockUpdateHomeParams, {
        ...mockUserInfo,
        id: 8,
      });

      expect(mockUpdateHome).toBeCalled();
    });
  });
});
