// supplier.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from '../dto/supplier.dto';
import { Supplier } from '.prisma/client'; // Import Supplier model

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async createSupplier(
    createSupplierDto: CreateSupplierDto,
  ): Promise<Supplier> {
    return this.prisma.supplier.create({
      data: createSupplierDto,
    });
  }

  async updateSupplier(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Nhà cung cấp không tồn tại.');
    }
    return this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
    });
  }

  async deleteSupplier(id: string): Promise<Supplier> {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Nhà cung cấp không tồn tại.');
    }
    return this.prisma.supplier.delete({ where: { id } });
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return this.prisma.supplier.findMany();
  }

  async getSupplierById(id: string): Promise<Supplier> {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Nhà cung cấp không tồn tại.');
    }
    return supplier;
  }
}
