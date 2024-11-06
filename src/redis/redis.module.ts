// src/modules/redis/redis.module.ts
import { Module } from '@nestjs/common';
import { RedisService } from './services/redis.service';
import { RedisController } from './controllers/redis.controller';
import { createRedisClient } from '../config/redis.config';


@Module({
  controllers: [RedisController],
  providers: [RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: createRedisClient, // Sử dụng hàm tạo Redis Client đúng cách
    },],
  exports: [RedisService], 
})
export class RedisModule {}