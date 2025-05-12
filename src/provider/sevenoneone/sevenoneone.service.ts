import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateProxy } from './dto/create-proxy.dto';
import { Period } from '@prisma/client';
import { CreateProxyRdo } from './rdo/create-proxy.rdo';

@Injectable()
export class SevenOneOneService {
  token: string;
  sevenoneone: AxiosInstance;
  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('SEVEN_ONE_ONE_TOKEN');
    if (!token) {
      throw new Error('SEVEN_ONE_ONE_TOKEN IS MISSING IN .ENV');
    }
    this.token = token;
    this.sevenoneone = axios.create({
      baseURL: 'https://server.711proxy.com',
    });
  }
  async create(data: CreateProxy): Promise<CreateProxyRdo> {
    const expire = await this.convertPeriod(data.period);
    const flow = await this.convertToBytes(data.traffic, data.quantity);
    const response = await this.sevenoneone.post('/eapi/order/', {
      expire: expire.toISOString(),
      flow: flow,
    });
    return {
      status: response.data.order_no ? 'success' : 'error',
      order_no: response.data.order_no,
    };
  }
  async convertToBytes(traffic: string, quantity: number): Promise<number> {
    const regex = /^(\d+(?:\.\d+)?)\s*(KB|MB|GB|TB)$/i;
    const match = traffic.trim().toUpperCase().match(regex);

    if (!match) {
      throw new HttpException('Invalid format', 500);
    }

    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    const multipliers: Record<string, number> = {
      kb: 1024,
      mb: 1024 ** 2,
      gb: 1024 ** 3,
      tb: 1024 ** 4,
    };

    return value * quantity * multipliers[unit];
  }
  async convertPeriod(period: Period): Promise<Date> {
    const now = new Date();

    const monthsToAdd: Record<Period, number> = {
      [Period.month]: 1,
      [Period.three_months]: 3,
      [Period.six_months]: 6,
    };

    const months = monthsToAdd[period];

    return new Date(now.setMonth(now.getMonth() + months));
  }
}
