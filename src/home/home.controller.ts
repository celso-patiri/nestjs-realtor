import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { PropertyType, UserType } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { DecodedUser, User } from 'src/user/decorators/user.decorator';
import {
  CreateHomeDTO,
  HomeResponseDTO,
  InquireHomeDTO,
  UpdateHomeDTO,
} from './dtos/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('')
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDTO[]> {
    const priceFilter =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(priceFilter && { price: priceFilter }),
      ...(propertyType && { propertyType }),
    };

    return this.homeService.getHomes(filters);
  }

  @Get('/:id')
  getHomesById(@Param('id') id: number) {
    return this.homeService.getHomeById(id);
  }

  @Post()
  @Roles(UserType.ADMIN, UserType.REALTOR)
  createHome(@Body() body: CreateHomeDTO, @User() user: DecodedUser) {
    return this.homeService.createHome(body, user.id);
  }

  @Put('/:id')
  @Roles(UserType.ADMIN, UserType.REALTOR)
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDTO,
    @User() user: DecodedUser,
  ) {
    const realtor = await this.homeService.getRealterByHomeId(id);
    if (!realtor.id !== !user?.id) throw new UnauthorizedException();

    return this.homeService.updateHomeById(id, body);
  }

  @Delete('/:id')
  @Roles(UserType.ADMIN, UserType.REALTOR)
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: DecodedUser,
  ) {
    const realtor = await this.homeService.getRealterByHomeId(id);
    if (!realtor.id !== !user?.id) throw new UnauthorizedException();

    return this.homeService.deleteHomeById(id);
  }

  @Post('/:id/inquire')
  @Roles(UserType.BUYER)
  inquire(
    @Param('id', ParseIntPipe) id: number,
    @Body() { message }: InquireHomeDTO,
    @User() user: DecodedUser,
  ) {
    return this.homeService.inquire(user, id, message);
  }

  @Get('/:id/messages')
  @Roles(UserType.REALTOR)
  async getHomeMessages(
    @Param('id', ParseIntPipe) id: number,
    @User() user: DecodedUser,
  ) {
    const realtor = await this.homeService.getRealterByHomeId(id);
    if (realtor.id !== user.id) throw new UnauthorizedException();

    return this.homeService.getMessagesByHome(id);
  }
}
