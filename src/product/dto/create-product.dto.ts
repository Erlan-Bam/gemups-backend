// create-product.dto.ts
import { IsDecimal, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Period, ProductType, Provider } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({
    example: '100 Mb',
    description: 'Traffic included in product',
  })
  @IsString()
  traffic: string;

  @ApiProperty({
    example: '19.99',
    description: 'Product price as decimal string',
  })
  @IsDecimal()
  price: string;

  @ApiProperty({ enum: Provider, description: 'Provider of the product' })
  @IsEnum(Provider)
  provider: Provider;

  @ApiProperty({ enum: ProductType, description: 'Type of the product' })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({
    enum: Period,
    description: 'Billing period',
    default: Period.month,
  })
  @IsEnum(Period)
  period: Period;
}
