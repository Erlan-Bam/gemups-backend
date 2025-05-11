import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [AuthModule, UserModule, SharedModule, PaymentModule],
})
export class AppModule {}
