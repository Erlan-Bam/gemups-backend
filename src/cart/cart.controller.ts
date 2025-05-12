import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-item')
  @UseGuards(AuthGuard('jwt'))
  async addItem(@Body() data: AddToCartDto, @Request() request) {
    data.user_id = request.user.id;
    return await this.cartService.addItem(data);
  }

  @Delete('remove-item')
  @UseGuards(AuthGuard('jwt'))
  async removeItem(@Body() data: RemoveFromCartDto, @Request() request) {
    data.user_id = request.user.id;
    return await this.cartService.removeItem(data);
  }
}
