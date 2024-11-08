// transaction.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsInt } from 'class-validator';
import { TransactionType } from '.prisma/client'; // Import enum TransactionType

export class CreateTransactionDto {
  @ApiProperty({ example: 'SKU123456', description: 'SKU của sản phẩm' })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({
    example: 'IN',
    description: 'Loại giao dịch ("IN" hoặc "OUT")',
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiProperty({ example: 50, description: 'Số lượng nhập/xuất' })
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @ApiProperty({
    example: 'Nhập hàng từ nhà cung cấp',
    description: 'Ghi chú thêm cho giao dịch',
  })
  @IsString()
  remarks?: string;
}

export class ApproveTransactionDto {
  @ApiProperty({
    example: 'transactionId123',
    description: 'ID giao dịch cần phê duyệt',
  })
  @IsNotEmpty()
  @IsString()
  transactionId: string;
}
