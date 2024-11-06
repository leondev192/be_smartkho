import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

import { ConfigModule } from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { TransactionHistoryModule } from './modules/transaction-history/transaction-history.module';
import { SupplierModule } from './modules/supplier/supplier.module';

import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule,
    PrismaModule,
    RedisModule,
    AuthModule,
    UserModule,
    ProductModule,
    TransactionModule,
    TransactionHistoryModule,
    SupplierModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
