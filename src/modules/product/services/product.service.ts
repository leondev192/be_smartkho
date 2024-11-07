import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { Product } from '.prisma/client'; // Import Product model
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<{ status: string; message: string; data: Product }> {
    // Check if a product with the same SKU already exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });

    if (existingProduct) {
      throw new ConflictException('A product with this SKU already exists.');
    }

    // Create the product if SKU is unique
    const product = await this.prisma.product.create({
      data: createProductDto,
    });

    return {
      status: 'success',
      message: 'Product created successfully.',
      data: product,
    };
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<{ status: string; message: string; data: Product }> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const skuExists = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });
      if (skuExists) {
        throw new ConflictException('A product with this SKU already exists.');
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    return {
      status: 'success',
      message: 'Product updated successfully.',
      data: updatedProduct,
    };
  }

  async deleteProduct(
    id: string,
  ): Promise<{ status: string; message: string; data: null }> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    await this.prisma.product.delete({ where: { id } });

    return {
      status: 'success',
      message: 'Product deleted successfully.',
      data: null,
    };
  }

  async getAllProducts(): Promise<{
    status: string;
    message: string;
    data: Product[];
  }> {
    const products = await this.prisma.product.findMany();

    return {
      status: 'success',
      message: 'Product list retrieved successfully.',
      data: products,
    };
  }

  async getProductById(
    id: string,
  ): Promise<{ status: string; message: string; data: Product }> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return {
      status: 'success',
      message: 'Product details retrieved successfully.',
      data: product,
    };
  }
}
