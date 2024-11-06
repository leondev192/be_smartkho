// src/modules/redis/controllers/redis.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { RedisController } from './controllers/redis.controller';
import { RedisService } from './services/redis.service';
import { CreateRedisDto } from './dto/create-redis.dto';

describe('RedisController', () => {
  let controller: RedisController;
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedisController],
      providers: [
        {
          provide: RedisService,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RedisController>(RedisController);
    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should set a key', async () => {
    const createRedisDto: CreateRedisDto = { key: 'testKey', value: 'testValue' };
    await controller.set(createRedisDto);
    expect(service.set).toHaveBeenCalledWith(createRedisDto.key, createRedisDto.value, 3600);
  });

  it('should get a key', async () => {
    const key = 'testKey';
    const value = 'testValue';
    jest.spyOn(service, 'get').mockResolvedValue(value);
    const result = await controller.get(key);
    expect(result).toEqual({ key, value });
  });

  it('should delete a key', async () => {
    const key = 'testKey';
    await controller.del(key);
    expect(service.del).toHaveBeenCalledWith(key);
  });
});