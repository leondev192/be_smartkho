import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { PrismaController } from './controllers/prisma.controller';

@Module({
  controllers: [PrismaController],
  providers: [PrismaService],
  exports:[PrismaService]
})
export class PrismaModule {}
