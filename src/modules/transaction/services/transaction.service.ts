import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma.service';
import {
  CreateTransactionDto,
  ApproveTransactionDto,
} from '../dto/transaction.dto';
import { Transaction, Product } from '.prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<{ status: string; message: string; data: Transaction }> {
    const { productId, transactionType, quantity } = createTransactionDto;

    // Fetch product to check current stock level
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    // Adjust stock based on transaction type
    let updatedQuantity = product.quantityInStock; // Use `quantityInStock` instead of `stockQuantity`
    if (transactionType === 'IN') {
      updatedQuantity += quantity;
    } else if (transactionType === 'OUT') {
      if (product.quantityInStock < quantity) {
        throw new BadRequestException('Not enough stock for this transaction.');
      }
      updatedQuantity -= quantity;
    } else {
      throw new BadRequestException('Invalid transaction type.');
    }

    // Update the product's quantity in stock
    await this.prisma.product.update({
      where: { id: productId },
      data: { quantityInStock: updatedQuantity }, // Update `quantityInStock`
    });

    // Record the transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        createdBy: 'adminId', // Replace with actual user ID
      },
    });

    return {
      status: 'success',
      message: 'Transaction successfully created.',
      data: transaction,
    };
  }

  async approveTransaction(
    approveTransactionDto: ApproveTransactionDto,
  ): Promise<{ status: string; message: string; data: Transaction }> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: approveTransactionDto.transactionId },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: approveTransactionDto.transactionId },
      data: {
        approved: true,
        approvedBy: 'adminId', // Replace with actual user ID
      },
    });

    return {
      status: 'success',
      message: 'Transaction approved successfully.',
      data: updatedTransaction,
    };
  }
  async getAllTransactions(): Promise<{
    status: string;
    message: string;
    data: (Transaction & { product: { name: string } })[];
  }> {
    const transactions = await this.prisma.transaction.findMany({
      include: {
        product: {
          select: {
            name: true, // Select only the product name
          },
        },
      },
    });

    return {
      status: 'success',
      message: 'List of transactions with product names.',
      data: transactions,
    };
  }

  async getTransactionStatistics(): Promise<{
    status: string;
    message: string;
    data: any;
  }> {
    const transactions = await this.prisma.transaction.findMany();
    const stats = transactions.reduce((acc, transaction) => {
      const type = transaction.transactionType;
      const productId = transaction.productId;
      acc[type] = acc[type] || {};
      acc[type][productId] = (acc[type][productId] || 0) + 1;
      return acc;
    }, {});

    return {
      status: 'success',
      message: 'Transaction statistics by type and product.',
      data: stats,
    };
  }
  async getTransactionsByProductId(
    productId: string,
  ): Promise<{ status: string; message: string; data: Transaction[] }> {
    const transactions = await this.prisma.transaction.findMany({
      where: { productId },
    });

    if (!transactions.length) {
      throw new NotFoundException('Không có giao dịch nào cho sản phẩm này.');
    }

    return {
      status: 'success',
      message: `Lịch sử giao dịch cho sản phẩm ${productId}.`,
      data: transactions,
    };
  }
}
