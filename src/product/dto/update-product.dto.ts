import { IsDecimal, IsEnum, IsOptional, IsString } from 'class-validator';
import { ProductType, Provider } from '@prisma/client';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  traffic: string;

  @IsOptional()
  @IsDecimal()
  price: any;

  @IsOptional()
  @IsEnum(Provider)
  provider: Provider;

  @IsOptional()
  @IsEnum(ProductType)
  type: ProductType;
}
