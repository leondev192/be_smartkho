// src/modules/redis/dto/update-redis.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateRedisDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}