import { Period } from '@prisma/client';

export interface CreateProxyDto {
  period: Period;
  traffic: string;
  quantity: number;
}
