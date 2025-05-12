import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProviderModule } from 'src/provider/provider.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [ProviderModule, SharedModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
