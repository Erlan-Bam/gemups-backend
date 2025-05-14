import { Period } from '@prisma/client';

export interface ProlongProxyDto {
  period: Period;
  traffic: string;
  quantity: number;
  username: string;
  passwd: string;
}
