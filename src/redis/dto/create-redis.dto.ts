// src/modules/redis/dto/create-redis.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRedisDto {
  @IsString()
  @ApiProperty({example:'key', description:'Enter key'})
  @IsNotEmpty()
  key: string;
  
  @IsString()
  @ApiProperty({example:'value', description:'Enter value'})
  @IsNotEmpty()
  value: string;
}