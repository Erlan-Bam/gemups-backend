import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateCryptomusInvoiceDto } from './dto/create-cryptomus-invoce.dto';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { CryptomusWebhookDto } from './dto/cryptomus-webhook.dto';
import { PaymentStatus } from '@prisma/client';
import { TestWebhookDto } from './dto/test-webhook.dto';

@Injectable()
export class PaymentService {
  cryptomus: AxiosInstance;
  merchantId: string;
  apiKey: string;
  baseFrontendURL: string;
  baseBackendURL: string;
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const [merchantId, apiKey, baseFrontendURL, baseBackendURL] = [
      this.configService.get<string>('CRYPTOMUS_MERCHANT_ID'),
      this.configService.get<string>('CRYPTOMUS_API_KEY'),
      this.configService.get<string>('FRONTEND_URL'),
      this.configService.get<string>('BACKEND_URL'),
    ];
    if (!merchantId || !apiKey || !baseFrontendURL || !baseBackendURL) {
      throw new Error(
        'CRYPTOMUS_MERCHANT_ID, CRYPTOMUS_API_KEY, FRONTEND_URL or BACKEND_URL IS MISSING IN .ENV',
      );
    }
    this.merchantId = merchantId;
    this.apiKey = apiKey;
    this.baseFrontendURL = baseFrontendURL;
    this.baseBackendURL = baseBackendURL;
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
      currency: 'USD',
      order_id: `${data.user_id}_${Date.now()}`,
      url_return: this.baseFrontendURL,
      url_success: this.baseFrontendURL,
      url_callback: `${this.baseBackendURL}/api/payment/cryptomus/webhook`,
      is_payment_multiple: false,
      lifetime: 43200,
      to_currency: 'USDT',
    };
    console.log(payload);
    try {
      const response = await this.cryptomus.post('/v1/payment', payload, {
        headers: {
          sign: await this.generateSign(payload),
        },
      });
      return {
        url: response.data.result.url,
        orderId: response.data.result.order_id,
      };
    } catch (error) {
      console.log(error.response.data);
      throw new HttpException('Invalid amount or order id', 400);
    }
  }

  async cryptomusWebhook(data: CryptomusWebhookDto) {
    const isValid = await this.verifyCryptomusSignature(data);
    if (!isValid) {
      throw new HttpException('Invalid signature', 400);
    }
    const [userId, _] = data.order_id.split('_');
    const payment = await this.prisma.payment.findUnique({
      where: {
        cryptomus_order_id: data.uuid,
      },
    });
    if (!payment) {
      await this.prisma.payment.create({
        data: {
          amount: data.amount,
          status: data.status,
          user_id: userId,
          cryptomus_order_id: data.uuid,
        },
      });
    } else {
      await this.prisma.payment.update({
        where: {
          cryptomus_order_id: data.uuid,
        },
        data: {
          status: data.status,
        },
      });
    }
    if (
      data.status === PaymentStatus.paid ||
      data.status === PaymentStatus.paid_over ||
      data.status === PaymentStatus.wrong_amount
    ) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: data.payment_amount_usd } },
      });
    }
    return 'success';
  }

  async verifyCryptomusSignature(data: any): Promise<boolean> {
    const receivedSign = data.sign;
    if (!receivedSign) return false;

    const newData = data;
    delete newData.sign;

    const json = JSON.stringify(newData).replace(/\\u([\dA-F]{4})/gi, (_, g1) =>
      String.fromCharCode(parseInt(g1, 16)),
    );

    const expectedSign = createHash('md5')
      .update(Buffer.from(json).toString('base64') + this.apiKey)
      .digest('hex');

    return expectedSign === receivedSign;
  }

  async generateSign(data: any): Promise<string> {
    const json = JSON.stringify(data);
    const sign = createHash('md5')
      .update(Buffer.from(json).toString('base64') + this.apiKey)
      .digest('hex');
    return sign;
  }
  async sendCryptomusTestWebhook(data: TestWebhookDto) {
    try {
      const response = await this.cryptomus.post(
        '/v1/test-webhook/payment',
        data,
        {
          headers: {
            sign: await this.generateSign(data),
          },
        },
      );
      return {
        status: 'ok',
      };
    } catch (error) {
      throw new HttpException('Invalid amount or order id', 400);
    }
  }
}
