// update-product.dto.ts
import { IsDecimal, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType, Provider } from '@prisma/client';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: '50 Mb' })
  @IsOptional()
  @IsString()
  traffic: string;

  @ApiPropertyOptional({ example: '29.99' })
  @IsOptional()
  @IsDecimal()
  price: any;

  @ApiPropertyOptional({ enum: Provider })
  @IsOptional()
  @IsEnum(Provider)
  provider: Provider;

  @ApiPropertyOptional({ enum: ProductType })
  @IsOptional()
  @IsEnum(ProductType)
  type: ProductType;
}
