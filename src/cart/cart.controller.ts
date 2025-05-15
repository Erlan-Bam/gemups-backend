import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-item')
  @ApiOperation({ summary: 'Добавить товар в корзину' })
  @ApiBody({ type: AddToCartDto })
  async addItem(@Body() data: AddToCartDto) {
    return await this.cartService.addItem(data);
  }

  @Delete('remove-item')
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  @ApiBody({ type: RemoveFromCartDto })
  async removeItem(@Body() data: RemoveFromCartDto) {
    return await this.cartService.removeItem(data);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Получить содержимое корзины' })
  async getCart(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.cartService.getCart(userId);
  }
}
