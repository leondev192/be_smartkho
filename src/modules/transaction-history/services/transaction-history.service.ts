// transaction-history.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { TransactionHistory } from '.prisma/client'; // Import TransactionHistory model
import { Transaction } from '.prisma/client'; // Import Transaction model

@Injectable()
export class TransactionHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getTransactionHistory(): Promise<TransactionHistory[]> {
    return this.prisma.transactionHistory.findMany();
  }

  async getTransactionHistoryByProductId(
    productId: string,
  ): Promise<TransactionHistory[]> {
    const transactions: Transaction[] = await this.prisma.transaction.findMany({
      where: {
        productId: productId,
      },
    });

    if (!transactions.length) {
      throw new NotFoundException('Không có giao dịch nào cho sản phẩm này.');
    }

    const transactionIds = transactions.map((transaction) => transaction.id);

    return this.prisma.transactionHistory.findMany({
      where: {
        transactionId: {
          in: transactionIds,
        },
      },
    });
  }
}
