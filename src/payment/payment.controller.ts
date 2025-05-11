import { Body, Controller, UseGuards, Request, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentService } from './payment.service';
import { CreateCryptomusInvoiceDto } from './dto/create-cryptomus-invoce.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('cryptomus/invoice')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Cryptomus invoice' })
  @ApiBody({ type: CreateCryptomusInvoiceDto })
  async createCryptomusInvoice(
    @Body() data: CreateCryptomusInvoiceDto,
    @Request() request,
  ) {
    data.user_id = request.user.id;
    return await this.paymentService.createCryptomusInvoice(data);
  }

  @Post('cryptomus/webhook')
  @ApiOperation({ summary: 'Cryptomus payment webhook (internal)' })
  @ApiBody({ type: CreateCryptomusInvoiceDto })
  async cryptomusWebhook(
    @Body() data: CreateCryptomusInvoiceDto,
    @Request() request,
  ) {
    data.user_id = request.user.id;
    return await this.paymentService.createCryptomusInvoice(data);
  }
}
