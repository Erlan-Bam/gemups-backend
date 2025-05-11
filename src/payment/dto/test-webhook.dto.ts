import {
  IsString,
  IsUrl,
  IsUUID,
  IsOptional,
  IsIn,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TestWebhookDto {
  @ApiProperty({
    description: 'Webhook callback URL',
    example: 'http://localhost:6001/api/payment/cryptomus/webhook',
    minLength: 6,
    maxLength: 150,
  })
  @IsUrl({ require_tld: false })
  @Length(6, 150)
  url_callback: string;

  @ApiProperty({
    description: 'Invoice currency code',
    example: 'USD',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Network code',
    example: 'tron',
  })
  @IsString()
  network: string;

  @ApiPropertyOptional({
    description: 'UUID of the invoice (optional)',
    example: '9d1a9bfa-3140-4b8f-b1a5-e9c3e9d7b2d6',
  })
  @IsOptional()
  @IsUUID()
  uuid?: string;

  @ApiPropertyOptional({
    description: 'Order ID in your system',
    example: 'abc_123-test',
    minLength: 1,
  })
  @IsOptional()
  @IsString()
  order_id?: string;

  @ApiProperty({
    description: 'Payment status',
    example: 'paid',
    enum: [
      'process',
      'check',
      'paid',
      'paid_over',
      'fail',
      'wrong_amount',
      'cancel',
      'system_fail',
      'refund_process',
      'refund_fail',
      'refund_paid',
    ],
    default: 'paid',
  })
  @IsString()
  @IsIn([
    'process',
    'check',
    'paid',
    'paid_over',
    'fail',
    'wrong_amount',
    'cancel',
    'system_fail',
    'refund_process',
    'refund_fail',
    'refund_paid',
  ])
  status: string;
}
