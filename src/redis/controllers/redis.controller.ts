// src/modules/redis/controllers/redis.controller.ts
import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { RedisService } from '../services/redis.service';
import { CreateRedisDto } from '../dto/create-redis.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Cache')
@Controller('cache')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post()
  @ApiOperation({summary:'Create key and value'})
  @ApiResponse({status: 201, description:'Key set successfully'})
  async set(@Body() createRedisDto: CreateRedisDto) {
    const { key, value } = createRedisDto;
    await this.redisService.set(key, value, 3600); 
    return { message: 'Key set successfully' };
  }
  
  @Get(':key')
  @ApiOperation({summary:'List key and value'})
  @ApiResponse({status: 200, description:'Retrieved key value.'})
  async get(@Param('key') key: string) {
    const value = await this.redisService.get(key);
    return { key, value };
  }
  
  @Delete(':key')
  @ApiOperation({summary:'Delete key and value'})
  @ApiResponse({status: 200, description:'Key deleted successfully.'})
  async del(@Param('key') key: string) {
    await this.redisService.del(key);
    return { message: 'Key deleted successfully' };
  }
}