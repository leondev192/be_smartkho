// report.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportService } from '../services/report.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('inventory')
  @ApiOperation({ summary: 'Xem báo cáo tồn kho' })
  @ApiResponse({ status: 200, description: 'Thông tin báo cáo tồn kho.' })
  async getInventoryReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.reportService.getInventoryReport(startDate, endDate);
  }
}
