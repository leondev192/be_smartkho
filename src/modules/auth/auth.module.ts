import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport'; // Bổ sung PassportModule nếu sử dụng Passport
import { JwtStrategy } from './utils/strategies/jwt.strategy';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Đảm bảo sử dụng biến JWT_SECRET từ môi trường
      signOptions: { expiresIn: '24h' }, // Định nghĩa thời hạn của token
    }),
    RedisModule, // Đảm bảo RedisModule được import
    PassportModule.register({ defaultStrategy: 'jwt' }), // Đảm bảo PassportModule được đăng ký
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy], // Bổ sung JwtStrategy
  exports: [AuthService], // Đảm bảo AuthService được export để sử dụng trong các module khác
})
export class AuthModule {}
