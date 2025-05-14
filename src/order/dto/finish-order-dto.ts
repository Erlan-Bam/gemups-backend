import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FinishOrderDto {
  @ApiPropertyOptional({
    description: 'User ID (optional, will be overridden from JWT)',
    example: 'b512f93a-f3c2-4d87-b8e3-7a861a8c53fa',
  })
  @IsOptional()
  user_id: string;

  @ApiProperty({
    description: 'Order ID (UUID)',
    example: '9f4a5e59-2b53-4c3a-a9c7-6c3f5d6c4a13',
  })
  @IsUUID()
  order_id: string;
}
