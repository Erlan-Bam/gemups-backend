import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsUUID } from 'class-validator';

export class CreateCryptomusInvoiceDto {
  @ApiProperty({
    description: 'User ID (UUID format)',
    example: 'f3bb7763-46d0-4610-bb8c-edbb1f4a2cbc',
  })
  @IsUUID()
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
