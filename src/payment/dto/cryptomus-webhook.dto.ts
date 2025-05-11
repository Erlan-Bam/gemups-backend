import { IsString, IsNumber, IsUUID, IsEnum, IsDecimal } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class CryptomusWebhookDto {
  @IsUUID()
  uuid: string;

  @IsString()
  order_id: string;

  @IsDecimal()
  amount: number;

  @IsDecimal()
  payment_amount_usd: string;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsString()
  currency: string;

  @IsString()
  sign: string;
}
