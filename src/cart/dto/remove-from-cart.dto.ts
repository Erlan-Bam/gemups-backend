import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class RemoveFromCartDto {
  @IsOptional()
  user_id: string;

  @IsInt()
  product_id: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
