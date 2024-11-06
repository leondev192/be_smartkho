// supplier.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ example: 'Nhà cung cấp A', description: 'Tên nhà cung cấp' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '123456789', description: 'Thông tin liên lạc' })
  @IsOptional()
  @IsString()
  contactInfo?: string;

  @ApiProperty({ example: 'Địa chỉ nhà cung cấp', description: 'Địa chỉ' })
  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateSupplierDto {
  @ApiProperty({ example: 'Nhà cung cấp B', description: 'Tên nhà cung cấp' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '987654321', description: 'Thông tin liên lạc' })
  @IsOptional()
  @IsString()
  contactInfo?: string;

  @ApiProperty({ example: 'Địa chỉ khác', description: 'Địa chỉ' })
  @IsOptional()
  @IsString()
  address?: string;
}
