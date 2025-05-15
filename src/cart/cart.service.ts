import { HttpException, Injectable } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addItem(data: AddToCartDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: data.user_id },
    });
    if (!cart) {
      throw new HttpException('Cart not found', 404);
    }

    const product = await this.prisma.product.findUnique({
      where: { id: data.product_id },
    });
    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    const item = await this.prisma.cartItem.findUnique({
      where: {
        cart_id_product_id: {
          cart_id: cart.id,
          product_id: data.product_id,
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    if (item) {
      return await this.prisma.cartItem.update({
        where: { id: item.id },
        data: {
          quantity: item.quantity + data.quantity,
        },
      });
    }

    return await this.prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        product_id: data.product_id,
        quantity: data.quantity,
      },
    });
  }

  async removeItem(data: RemoveFromCartDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: data.user_id },
    });
    if (!cart) {
      throw new HttpException('Cart not found', 404);
    }

    const product = await this.prisma.product.findUnique({
      where: { id: data.product_id },
    });
    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    const item = await this.prisma.cartItem.findUnique({
      where: {
        cart_id_product_id: {
          cart_id: cart.id,
          product_id: data.product_id,
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    if (!item) {
      throw new HttpException('Item not found in cart', 404);
    }

    const remaining = Math.max(item.quantity - data.quantity, 0);
    if (!remaining) {
      return await this.prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      return await this.prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: remaining },
      });
    }
  }

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      select: {
        items: {
          select: {
            product: true,
            quantity: true,
          },
        },
      },
    });

    if (!cart) {
      throw new HttpException('Cart not found', 404);
    }

    return cart;
  }
}
