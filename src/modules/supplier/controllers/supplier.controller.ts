// supplier.controller.ts

import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSupplierDto, UpdateSupplierDto } from '../dto/supplier.dto';
import { Supplier } from '.prisma/client'; // Import Supplier model
import { SupplierService } from '../services/supplier.service';

@ApiTags('Suppliers')
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @ApiOperation({ summary: 'Thêm nhà cung cấp mới' })
  @ApiResponse({
    status: 201,
    description: 'Nhà cung cấp đã được thêm thành công.',
  })
  async createSupplier(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<Supplier> {
    return this.supplierService.createSupplier(createSupplierDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin nhà cung cấp' })
  @ApiResponse({
    status: 200,
    description: 'Nhà cung cấp đã được cập nhật thành công.',
  })
  async updateSupplier(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return this.supplierService.updateSupplier(id, updateSupplierDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa nhà cung cấp' })
  @ApiResponse({
    status: 200,
    description: 'Nhà cung cấp đã được xóa thành công.',
  })
  async deleteSupplier(@Param('id') id: string): Promise<Supplier> {
    return this.supplierService.deleteSupplier(id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách nhà cung cấp' })
  @ApiResponse({ status: 200, description: 'Danh sách nhà cung cấp.' })
  async getAllSuppliers(): Promise<Supplier[]> {
    return this.supplierService.getAllSuppliers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin nhà cung cấp theo ID' })
  @ApiResponse({ status: 200, description: 'Thông tin nhà cung cấp.' })
  async getSupplierById(@Param('id') id: string): Promise<Supplier> {
    return this.supplierService.getSupplierById(id);
  }
}
