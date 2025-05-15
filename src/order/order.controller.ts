import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { FinishOrderDto } from './dto/finish-order-dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new order for the authorized user' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async create(@Param('userId') userId: string) {
    return await this.orderService.create(userId);
  }

  @Post('finish/:userId')
  @ApiOperation({ summary: 'Finish an order by ID for the authorized user' })
  @ApiBody({ type: FinishOrderDto })
  @ApiResponse({ status: 200, description: 'Order finished successfully' })
  async finish(@Body() data: FinishOrderDto, @Param('userId') userId: string) {
    data.user_id = userId;
    return await this.orderService.finish(data);
  }
}
