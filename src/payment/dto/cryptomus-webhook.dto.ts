import { IsString, IsNumber, IsUUID, IsEnum } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class CryptomusWebhookDto {
  @IsUUID()
  uuid: string;

  @IsString()
  order_id: string;

  @IsNumber()
  amount: number;

  @IsString()
  payment_amount_usd: string;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsString()
  currency: string;

  @IsString()
  sign: string;
}
