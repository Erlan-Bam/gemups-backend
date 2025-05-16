import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { FinishOrderDto } from './dto/finish-order-dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProlongProxyDto } from './dto/prolong-proxy.dto';

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new order for the authorized user' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async create(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.orderService.create(userId);
  }

  @Post('finish/:userId')
  @ApiOperation({ summary: 'Finish an order by ID for the authorized user' })
  @ApiBody({ type: FinishOrderDto })
  @ApiResponse({ status: 200, description: 'Order finished successfully' })
  async finish(
    @Body() data: FinishOrderDto,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    data.user_id = userId;
    return await this.orderService.finish(data);
  }

  @Get('history/:userId')
  async getHistory(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.orderService.getHistory(userId);
  }

  @Get('proxy/:itemId')
  async getProxy(@Param('itemId', ParseIntPipe) itemId: number) {
    return await this.orderService.getProxy(itemId);
  }

  @Post('prolong-proxy')
  async prolongProxy(@Body() data: ProlongProxyDto) {
    return await this.orderService.prolongProxy(data);
  }
}
