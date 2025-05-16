import { Type } from 'class-transformer';
import { IsInt, IsPositive, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveFromCartDto {
  @ApiProperty({
    description: 'ID пользователя',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'ID продукта', example: 123 })
  @Type(() => Number)
  @IsInt()
  product_id: number;

  @ApiProperty({ description: 'Количество', example: 1, minimum: 1 })
  @IsInt()
  @IsPositive()
  quantity: number;
}
