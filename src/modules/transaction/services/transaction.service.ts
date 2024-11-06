// transaction.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma.service';
import {
  CreateTransactionDto,
  ApproveTransactionDto,
} from '../dto/transaction.dto';
import { Transaction } from '.prisma/client'; // Import Transaction model

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        createdBy: 'adminId', // Thay thế bằng ID người tạo thực tế
      },
    });
  }

  async approveTransaction(
    approveTransactionDto: ApproveTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: approveTransactionDto.transactionId },
    });
    if (!transaction) {
      throw new NotFoundException('Giao dịch không tồn tại.');
    }

    return this.prisma.transaction.update({
      where: { id: approveTransactionDto.transactionId },
      data: {
        approved: true,
        approvedBy: 'adminId', // Thay thế bằng ID người phê duyệt thực tế
      },
    });
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany();
  }

  async getTransactionStatistics(): Promise<any> {
    const transactions = await this.prisma.transaction.findMany();
    // Thống kê giao dịch theo loại (nhập/xuất), sản phẩm và thời gian
    const stats = transactions.reduce((acc, transaction) => {
      const type = transaction.transactionType;
      const productId = transaction.productId;
      acc[type] = acc[type] || {};
      acc[type][productId] = (acc[type][productId] || 0) + transaction.quantity;
      return acc;
    }, {});

    return stats;
  }
}
