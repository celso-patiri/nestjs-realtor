import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HomeResponseDTO {
  id: number;
  address: string;
  price: number;
  image: string;

  @Expose({ name: 'propertyType' })
  propertyType() {
    return this.property_type;
  }

  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }

  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listed_date;
  }

  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }

  @Exclude()
  number_of_bedrooms: number;

  @Exclude()
  number_of_bathrooms: number;
  city: string;

  @Exclude()
  listed_date: Date;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_aut: Date;

  @Exclude()
  realtor_id: number;

  @Exclude()
  land_size: number;

  @Exclude()
  property_type: PropertyType;

  constructor(partial: Partial<HomeResponseDTO>) {
    Object.assign(this, partial);
  }
}

export class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateHomeDTO {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;
  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}

export class UpdateHomeDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  numberOfBathrooms?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  numberOfBedrooms?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  landSize?: number;

  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;
}

export class InquireHomeDTO {
  @IsString()
  @IsNotEmpty()
  message: string;
}
