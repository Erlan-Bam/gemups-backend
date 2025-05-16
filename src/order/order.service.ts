import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { FinishOrderDto } from './dto/finish-order-dto';
import { OrderStatus, Provider } from '@prisma/client';
import { SevenOneOneService } from 'src/provider/sevenoneone/sevenoneone.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private sevenOneOne: SevenOneOneService,
  ) {}

  async create(user_id: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: user_id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart.items.length) {
      throw new HttpException('Cart is empty', 400);
    }

    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + item.quantity * Number(item.product.price);
    }, 0);

    const order = await this.prisma.order.create({
      data: {
        user_id: user_id,
        price: totalPrice,
        items: {
          create: cart.items.map((item) => ({
            quantity: item.quantity,
            price: Number(item.product.price) * item.quantity,
            product: {
              connect: { id: item.product_id },
            },
          })),
        },
      },
      include: {
        items: true,
      },
    });

    await this.prisma.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });

    return order;
  }

  async finish(data: FinishOrderDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.user_id },
      select: {
        id: true,
        balance: true,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const order = await this.prisma.order.findUnique({
      where: { id: data.order_id, user_id: data.user_id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new HttpException('Order not found', 404);
    }
    if (user.balance.lessThan(order.price)) {
      throw new HttpException('Insufficient balance', 400);
    }

    for (let item of order.items) {
      if (item.product.provider === Provider.SevenOneOne) {
        const result = await this.sevenOneOne.create({
          period: item.product.period,
          traffic: item.product.traffic,
          quantity: item.quantity,
        });
        if (result.status === 'success') {
          await this.prisma.$transaction([
            this.prisma.user.update({
              where: { id: user.id },
              data: { balance: { decrement: item.price } },
            }),
            this.prisma.orderItem.update({
              where: { id: item.id },
              data: {
                status: OrderStatus.executed,
                external_data: JSON.stringify({
                  order_no: result.order_no,
                  username: result.username,
                  passwd: result.passwd,
                }),
              },
            }),
          ]);
        } else {
          await this.prisma.orderItem.update({
            where: {
              id: item.id,
            },
            data: { status: OrderStatus.failed },
          });
        }
      } else {
        throw new HttpException('Unsupported provider', 400);
      }
    }
  }

  async getHistory(userId: string) {
    return await this.prisma.order.findMany({
      where: { user_id: userId },
      include: { items: { include: { product: true } } },
    });
  }

  async getProxy(itemId: number) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new HttpException('Order item not found', 404);
    }

    return;
  }
}
