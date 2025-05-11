import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { SharedModule } from 'src/shared/shared.module';
import { PrismaService } from 'src/shared/services/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [SharedModule],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService, ConfigService],
})
export class PaymentModule {}
