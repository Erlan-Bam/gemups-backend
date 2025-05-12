import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    return await this.prisma.product.create({
      data: data,
    });
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.product.count(),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
    });
    if (!product) {
      throw new HttpException('Product not found', 404);
    }
    return product;
  }

  async update(id: number, data: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
    });
    if (!product) {
      throw new HttpException('Product not found', 404);
    }
    return await this.prisma.product.update({
      where: { id: id },
      data: data,
    });
  }

  async remove(id: number) {
    const product = await this.prisma.product.delete({
      where: { id: id },
    });
    if (!product) {
      throw new HttpException('Product not found', 404);
    }
    return product;
  }
}
