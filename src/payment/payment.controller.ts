import {
  Body,
  Controller,
  UseGuards,
  Request,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentService } from './payment.service';
import { CreateCryptomusInvoiceDto } from './dto/create-cryptomus-invoce.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CryptomusWebhookDto } from './dto/cryptomus-webhook.dto';
import { TestWebhookDto } from './dto/test-webhook.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('cryptomus/invoice')
  @ApiOperation({ summary: 'Create a Cryptomus invoice' })
  @ApiBody({ type: CreateCryptomusInvoiceDto })
  async createCryptomusInvoice(@Body() data: CreateCryptomusInvoiceDto) {
    return await this.paymentService.createCryptomusInvoice(data);
  }

  @Post('cryptomus/webhook')
  @ApiOperation({ summary: 'Cryptomus payment webhook (internal)' })
  async cryptomusWebhook(@Body() data: CryptomusWebhookDto) {
    return await this.paymentService.cryptomusWebhook(data);
  }

  @Post('cryptomus/test-webhook')
  @ApiOperation({ summary: 'Trigger Cryptomus test webhook (internal)' })
  @ApiBody({ type: TestWebhookDto })
  async testWebhook(@Body() data: TestWebhookDto) {
    return await this.paymentService.sendCryptomusTestWebhook(data);
  }
}
