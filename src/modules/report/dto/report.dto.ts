// report.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetInventoryReportDto {
  @ApiProperty({ example: '2023-01-01', description: 'Ngày bắt đầu báo cáo' })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty({ example: '2023-12-31', description: 'Ngày kết thúc báo cáo' })
  @IsNotEmpty()
  @IsString()
  endDate: string;
}
