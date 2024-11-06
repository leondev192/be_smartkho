// src/prisma/prisma.controller.ts
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Database')
@Controller('database')
export class PrismaController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('check')
  @ApiOperation({summary:' Check connect to database'})
  async healthCheck() {
    return { status: 'Database is connected' };
  }

}