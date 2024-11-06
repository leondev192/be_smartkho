import { Module } from '@nestjs/common';
import { TransactionHistoryController } from './controllers/transaction-history.controller';
import { TransactionHistoryService } from './services/transaction-history.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/services/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionHistoryController],
  providers: [TransactionHistoryService, PrismaService],
})
export class TransactionHistoryModule {}
