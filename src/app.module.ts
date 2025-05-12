import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { PaymentModule } from './payment/payment.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { ProviderModule } from './provider/provider.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SharedModule,
    PaymentModule,
    ProductModule,
    CartModule,
    ProviderModule,
    OrderModule,
  ],
})
export class AppModule {}
