import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from '../dto/supplier.dto';
import { Supplier } from '.prisma/client'; // Import Supplier model

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async createSupplier(
    createSupplierDto: CreateSupplierDto,
  ): Promise<{ status: string; message: string; data: Supplier }> {
    const supplier = await this.prisma.supplier.create({
      data: createSupplierDto,
    });

    return {
      status: 'success',
      message: 'Nhà cung cấp đã được thêm thành công.',
      data: supplier,
    };
  }

  async updateSupplier(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<{ status: string; message: string; data: Supplier }> {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Nhà cung cấp không tồn tại.');
    }

    const updatedSupplier = await this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
    });

    return {
      status: 'success',
      message: 'Nhà cung cấp đã được cập nhật thành công.',
      data: updatedSupplier,
    };
  }

  async deleteSupplier(
    id: string,
  ): Promise<{ status: string; message: string; data: null }> {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Nhà cung cấp không tồn tại.');
    }

    await this.prisma.supplier.delete({ where: { id } });

    return {
      status: 'success',
      message: 'Nhà cung cấp đã được xóa thành công.',
      data: null,
    };
  }

  async getAllSuppliers(): Promise<{
    status: string;
    message: string;
    data: Supplier[];
  }> {
    const suppliers = await this.prisma.supplier.findMany();

    return {
      status: 'success',
      message: 'Danh sách nhà cung cấp.',
      data: suppliers,
    };
  }

  async getSupplierById(
    id: string,
  ): Promise<{ status: string; message: string; data: Supplier }> {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Nhà cung cấp không tồn tại.');
    }

    return {
      status: 'success',
      message: 'Thông tin nhà cung cấp.',
      data: supplier,
    };
  }
}
