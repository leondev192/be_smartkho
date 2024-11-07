import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionHistory } from '.prisma/client';
import { TransactionHistoryService } from '../services/transaction-history.service';

@ApiTags('Transaction History')
@Controller('transaction-history')
export class TransactionHistoryController {
  constructor(
    private readonly transactionHistoryService: TransactionHistoryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy lịch sử giao dịch' })
  @ApiResponse({ status: 200, description: 'Lịch sử giao dịch.' })
  async getTransactionHistory(): Promise<{
    status: string;
    message: string;
    data: TransactionHistory[];
  }> {
    return this.transactionHistoryService.getTransactionHistory();
  }

  @Get('by-product')
  @ApiOperation({ summary: 'Lấy lịch sử giao dịch theo sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'Lịch sử giao dịch cho sản phẩm cụ thể.',
  })
  async getTransactionHistoryByProductId(
    @Query('productId') productId: string,
  ): Promise<{ status: string; message: string; data: TransactionHistory[] }> {
    return this.transactionHistoryService.getTransactionHistoryByProductId(
      productId,
    );
  }
}
