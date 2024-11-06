// transaction.controller.ts

import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateTransactionDto,
  ApproveTransactionDto,
} from '../dto/transaction.dto';
import { Transaction } from '.prisma/client'; // Import Transaction model
import { TransactionService } from '../services/transaction.service';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Thêm giao dịch mới' })
  @ApiResponse({
    status: 201,
    description: 'Giao dịch đã được thêm thành công.',
  })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Post('approve')
  @ApiOperation({ summary: 'Phê duyệt giao dịch' })
  @ApiResponse({
    status: 200,
    description: 'Giao dịch đã được phê duyệt thành công.',
  })
  async approveTransaction(
    @Body() approveTransactionDto: ApproveTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.approveTransaction(approveTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách giao dịch' })
  @ApiResponse({ status: 200, description: 'Danh sách giao dịch.' })
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Thống kê giao dịch' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê giao dịch theo loại và sản phẩm.',
  })
  async getTransactionStatistics(): Promise<any> {
    return this.transactionService.getTransactionStatistics();
  }
}
