import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateCryptomusInvoiceDto } from './dto/create-cryptomus-invoce.dto';
import axios, { Axios } from 'axios';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

@Injectable()
export class PaymentService {
  cryptomus: Axios;
  merchantId: string;
  apiKey: string;
  baseFrontendURL: string;
  baseBackendURL: string;
  constructor(private configService: ConfigService) {
    const [merchantId, apiKey, baseFrontendURL] = [
      this.configService.get<string>('CRYPTOMUS_MERCHANT_ID'),
      this.configService.get<string>('CRYPTOMUS_API_KEY'),
      this.configService.get<string>('FRONTEND_URL'),
      this.configService.get<string>('BACKEND_URL'),
    ];
    if (!merchantId || !apiKey || !baseFrontendURL) {
      throw new Error(
        'CRYPTOMUS_MERCHANT_ID, CRYPTOMUS_API_KEY, FRONTEND_URL or BACKEND_URL IS MISSING IN .ENV',
      );
    }
    (this.merchantId = merchantId), (this.apiKey = apiKey);
    this.cryptomus = axios.create({
      baseURL: 'https://api.cryptomus.com',
      headers: {
        merchant: this.merchantId,
      },
    });
  }
  async createCryptomusInvoice(data: CreateCryptomusInvoiceDto) {
    const payload = {
      amount: data.amount,
      currenct: 'USD',
      orderId: `${data.user_id}_${data.order_id}_${Date.now()}`,
      url_return: this.baseFrontendURL,
      url_success: this.baseFrontendURL,
      url_callback: `${this.baseBackendURL}/api/payment/cryptomus/webhook`,
      is_payment_multiple: true,
      to_currency: 'USDT',
    };
    const response = await this.cryptomus.post('/v1/payment', payload, {
      headers: {
        sign: await this.generateSign(payload),
      },
    });

    return response.data;
  }

  async generateSign(data: any): Promise<string> {
    const json = JSON.stringify(data);
    const sign = createHash('md5')
      .update(Buffer.from(json).toString('base64') + this.apiKey)
      .digest('hex');
    return sign;
  }
}
