import { Period } from '@prisma/client';

export interface CreateProxy {
  period: Period;
  traffic: string;
  quantity: number;
}
