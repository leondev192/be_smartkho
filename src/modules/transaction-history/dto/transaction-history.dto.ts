// transaction-history.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetTransactionHistoryDto {
  @ApiProperty({
    example: 'productId123',
    description: 'ID sản phẩm để xem lịch sử giao dịch',
  })
  @IsString()
  productId: string;
}
