import { IsDecimal, IsEnum, IsString } from 'class-validator';
import { Period, ProductType, Provider } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  traffic: string;

  @IsDecimal()
  price: any;

  @IsEnum(Provider)
  provider: Provider;

  @IsEnum(ProductType)
  type: ProductType;

  @IsEnum(Period)
  period: Period;
}
