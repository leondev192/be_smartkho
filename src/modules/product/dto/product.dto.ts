// product.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'SKU123456', description: 'Mã SKU của sản phẩm' })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({ example: 'Nước khoáng', description: 'Tên sản phẩm' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Nước khoáng tinh khiết đóng chai',
    description: 'Mô tả sản phẩm',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Thức uống', description: 'Danh mục sản phẩm' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 100, description: 'Số lượng tồn kho hiện tại' })
  @IsInt()
  quantityInStock: number;

  @ApiProperty({ example: 10, description: 'Mức tồn kho tối thiểu' })
  @IsInt()
  reorderLevel: number;

  @ApiProperty({
    example: 'supplierId123',
    description: 'ID nhà cung cấp (nếu có)',
  })
  @IsOptional()
  @IsString()
  supplierId?: string;
}

export class UpdateProductDto {
  @ApiProperty({ example: 'Nước khoáng', description: 'Tên sản phẩm' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Nước khoáng tinh khiết đóng chai',
    description: 'Mô tả sản phẩm',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Thức uống', description: 'Danh mục sản phẩm' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 100, description: 'Số lượng tồn kho hiện tại' })
  @IsOptional()
  @IsInt()
  quantityInStock?: number;

  @ApiProperty({ example: 10, description: 'Mức tồn kho tối thiểu' })
  @IsOptional()
  @IsInt()
  reorderLevel?: number;

  @ApiProperty({
    example: 'supplierId123',
    description: 'ID nhà cung cấp (nếu có)',
  })
  @IsOptional()
  @IsString()
  supplierId?: string;
}
