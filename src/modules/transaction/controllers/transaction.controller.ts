import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateTransactionDto,
  ApproveTransactionDto,
} from '../dto/transaction.dto';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '@prisma/client';

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
  ): Promise<{ status: string; message: string; data: Transaction }> {
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
  ): Promise<{ status: string; message: string; data: Transaction }> {
    return this.transactionService.approveTransaction(approveTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách giao dịch' })
  @ApiResponse({ status: 200, description: 'Danh sách giao dịch.' })
  async getAllTransactions(): Promise<{
    status: string;
    message: string;
    data: Transaction[];
  }> {
    return this.transactionService.getAllTransactions();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Thống kê giao dịch' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê giao dịch theo loại và sản phẩm.',
  })
  async getTransactionStatistics(): Promise<{
    status: string;
    message: string;
    data: any;
  }> {
    return this.transactionService.getTransactionStatistics();
  }
  @Get('by-product')
  @ApiOperation({ summary: 'Lấy giao dịch theo sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'Lịch sử giao dịch cho sản phẩm cụ thể.',
  })
  async getTransactionsByProductId(
    @Query('productId') productId: string,
  ): Promise<{ status: string; message: string; data: Transaction[] }> {
    return this.transactionService.getTransactionsByProductId(productId);
  }
}
