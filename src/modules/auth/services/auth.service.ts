import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/services/prisma.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  GoogleLoginDto,
} from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { randomBytes } from 'crypto';
import { RedisService } from 'src/redis/services/redis.service';
import { sendOtpEmail } from '../utils/sendOtp.util'; // Tạo hàm gửi email OTP

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private client: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    this.client = new OAuth2Client(googleClientId);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new BadRequestException('Email không tồn tại.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu không đúng.');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Trả về đầy đủ thông tin của người dùng
    return {
      status: 'success',
      message: 'Đăng nhập thành công.',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new BadRequestException('Email không tồn tại.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo OTP ngẫu nhiên 6 chữ số
    await sendOtpEmail(email, otp); // Gửi email OTP

    await this.redisService.set(
      email,
      JSON.stringify({ email, otpTimestamp: Date.now() }),
      300,
    );
    return { message: 'Mã OTP đã được gửi đến email của bạn.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { resetToken, newPassword } = resetPasswordDto;

    const email = await this.redisService.get(resetToken);
    if (!email) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn.');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại.');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });
    await this.redisService.del(resetToken);

    return { message: 'Mật khẩu đã được cập nhật thành công.' };
  }

  async loginWithGoogle(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload) {
        throw new BadRequestException(
          'Không tìm thấy payload từ Google ID Token.',
        );
      }

      const { email } = payload;

      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        throw new BadRequestException(
          'Tài khoản với email này chưa được đăng ký.',
        );
      }

      const token = this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        message: 'Đăng nhập Google thành công.',
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
          phoneNumber: user.phoneNumber,
          address: user.address,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error) {
      throw new BadRequestException('Đăng nhập với Google thất bại.');
    }
  }
}
