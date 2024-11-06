// report.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async getInventoryReport(startDate: string, endDate: string): Promise<any> {
    const products = await this.prisma.product.findMany();

    const report = products.map((product) => ({
      sku: product.sku,
      name: product.name,
      quantityInStock: product.quantityInStock,
      reorderLevel: product.reorderLevel,
      needsRestock: product.quantityInStock < product.reorderLevel,
    }));

    return report;
  }
}
