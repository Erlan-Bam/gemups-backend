import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class RemoveFromCartDto {
  @IsOptional()
  user_id: string;

  @Type(() => Number)
  @IsInt()
  product_id: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
