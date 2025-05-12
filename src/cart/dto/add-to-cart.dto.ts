import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class AddToCartDto {
  @IsOptional()
  user_id: string;

  @IsInt()
  product_id: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
