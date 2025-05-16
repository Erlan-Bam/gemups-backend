import { IsInt, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProlongProxyDto {
  @ApiProperty({
    description: 'User ID (optional, will be overridden from JWT)',
    example: 'b512f93a-f3c2-4d87-b8e3-7a861a8c53fa',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'Order item ID',
    example: 1,
  })
  @IsInt()
  item_id: number;
}
