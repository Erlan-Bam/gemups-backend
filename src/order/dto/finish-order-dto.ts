import { IsOptional, IsUUID } from 'class-validator';

export class FinishOrderDto {
  @IsOptional()
  user_id: string;

  @IsUUID()
  order_id: string;
}
