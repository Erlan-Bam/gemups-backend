import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateProxyDto } from './dto/create-proxy.dto';
import { Period } from '@prisma/client';
import { CreateProxyRdo } from './rdo/create-proxy.rdo';
import { GetProxyRdo } from './rdo/get-proxy.rdo';
import { ProlongProxyDto } from './dto/prolong-proxy.dto';

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
  async create(data: CreateProxyDto): Promise<CreateProxyRdo> {
    const expire = await this.convertPeriod(data.period);
    const flow = await this.convertToBytes(data.traffic, data.quantity);
    const response = await this.sevenoneone.post('/eapi/order/', {
      expire: expire.toISOString(),
      flow: flow,
    });
    if (response.data.error) {
      return {
        status: 'error',
        error: response.data.error,
        order_no: undefined,
      };
    } else {
      return {
        status: 'success',
        order_no: response.data.order_no,
        username: response.data.username,
        passwd: response.data.passwd,
      };
    }
  }
  async get(order_no: number): Promise<GetProxyRdo> {
    const response = await this.sevenoneone.get('/eapi/order/', {
      params: {
        order_no: order_no,
      },
    });
    const data = response.data;

    if (data.error) {
      return {
        status: 'error',
        code: data.code,
        msg: data.msg,
        error: data.error,
      };
    }

    return {
      status: 'success',
      code: data.code,
      msg: data.msg,
      error: data.error,
      username: data.username,
      passwd: data.passwd,
      host: data.host,
      port: data.port,
      proto: data.proto,
      expire: data.expire,
      un: data.un,
      order_flow: data.order_flow,
      order_flow_after: data.order_flow_after,
      order_flow_befor: data.order_flow_befor,
      order_no: data.order_no,
      restitution_no: data.restitution_no,
      un_flow: data.un_flow,
      un_flow_used: data.un_flow_used,
      un_status: data.un_status,
    };
  }
  async prolong(data: ProlongProxyDto) {
    const expire = await this.convertPeriod(data.period);
    const flow = await this.convertToBytes(data.traffic, data.quantity);
    const response = await this.sevenoneone.post('/eapi/order/allocate', {
      expire: expire.toISOString(),
      flow: flow,
    });
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
