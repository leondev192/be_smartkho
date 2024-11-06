// src/modules/redis/services/redis.service.ts
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { createRedisClient } from '../../config/redis.config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis;

  constructor() {
    this.redisClient = createRedisClient();
  }

  onModuleInit() {
    this.logger.log('Redis client connected');
  }

  onModuleDestroy() {
    this.redisClient.quit();
    this.logger.log('Redis client disconnected');
  }

  async set(key: string, value: string, ttl: number) {
    try {
      await this.redisClient.set(key, value, 'EX', ttl);
      this.logger.log(`Stored key: ${key} with TTL: ${ttl}`);
    } catch (error) {
      this.logger.error(`Error storing key: ${key} - ${error.message}`);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.redisClient.get(key);
      this.logger.log(`Retrieved key: ${key} with value: ${value}`);
      return value;
    } catch (error) {
      this.logger.error(`Error retrieving key: ${key} - ${error.message}`);
      throw error;
    }
  }

  async del(key: string) {
    try {
      await this.redisClient.del(key);
      this.logger.log(`Deleted key: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting key: ${key} - ${error.message}`);
      throw error;
    }
  }
}