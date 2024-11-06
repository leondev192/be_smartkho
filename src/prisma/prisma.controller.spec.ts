// src/prisma/prisma.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaController } from './controllers/prisma.controller';
import { PrismaService } from './services/prisma.service';

describe('PrismaController', () => {
  let controller: PrismaController;
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrismaController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            healthCheck: jest.fn().mockResolvedValue({ status: 'Prisma is connected' }),
          },
        },
      ],
    }).compile();

    controller = module.get<PrismaController>(PrismaController);
    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health status', async () => {
    const result = await controller.healthCheck();
    expect(result).toEqual({ status: 'Prisma is connected' });
  });
});