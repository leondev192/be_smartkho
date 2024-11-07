import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { TransactionHistory } from '.prisma/client';

@Injectable()
export class TransactionHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getTransactionHistory(): Promise<{
    status: string;
    message: string;
    data: TransactionHistory[];
  }> {
    const transactionHistory = await this.prisma.transactionHistory.findMany();
    return {
      status: 'success',
      message: 'Transaction history.',
      data: transactionHistory,
    };
  }

  async getTransactionHistoryByProductId(
    productId: string,
  ): Promise<{ status: string; message: string; data: TransactionHistory[] }> {
    // Ensure productId is a valid format or check its existence in the database if necessary
    const transactionHistory = await this.prisma.transactionHistory.findMany({
      where: { productId },
      orderBy: { timestamp: 'desc' }, // Order by the timestamp of the transaction
    });

    if (!transactionHistory.length) {
      throw new NotFoundException(
        'No transaction history found for this product.',
      );
    }

    return {
      status: 'success',
      message: `Transaction history for product ${productId}.`,
      data: transactionHistory,
    };
  }
}
