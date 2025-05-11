import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateCryptomusInvoiceDto {
  @IsOptional({
    message:
      'User id comes from parsing JWT, you do not need to include this value in body',
  })
  user_id: string;

  @ApiProperty({
    description: 'Invoice amount in decimal format',
    example: '12.34',
  })
  @IsDecimal(
    { decimal_digits: '1,2' },
    {
      message:
        'Amount must be a decimal with 1 to 2 digits after the decimal point',
    },
  )
  amount: string;
}
