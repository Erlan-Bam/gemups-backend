import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { FinishOrderDto } from './dto/finish-order-dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Post('')
  @UseGuards(AuthGuard('jwt'))
  async create(@Request() request) {
    return await this.orderService.create(request.user.id);
  }

  @Post('finish/:id')
  @UseGuards(AuthGuard('jwt'))
  async finish(@Body() data: FinishOrderDto, @Request() request) {
    data.user_id = request.user.id;
    return await this.orderService.finish(data);
  }
}
