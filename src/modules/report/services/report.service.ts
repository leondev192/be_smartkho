import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async getInventoryReport(
    startDate: string,
    endDate: string,
  ): Promise<{ status: string; message: string; data: any }> {
    const products = await this.prisma.product.findMany();

    const report = products.map((product) => ({
      sku: product.sku,
      name: product.name,
      quantityInStock: product.quantityInStock,
      reorderLevel: product.reorderLevel,
      needsRestock: product.quantityInStock < product.reorderLevel,
    }));

    return {
      status: 'success',
      message: 'Báo cáo tồn kho đã được tạo thành công.',
      data: report, // Trả về báo cáo dưới dạng dữ liệu
    };
  }
}
