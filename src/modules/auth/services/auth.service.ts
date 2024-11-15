import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/services/prisma.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  GoogleLoginDto,
  VerifyOtpDto,
} from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
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

    return {
      status: 'success',
      message: 'Đăng nhập thành công.',
      data: {
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await sendOtpEmail(email, otp);

    await this.redisService.set(
      email,
      JSON.stringify({ otp: hashedOtp, otpTimestamp: Date.now() }),
      300,
    );

    return {
      status: 'success',
      message: 'Mã OTP đã được gửi đến email của bạn.',
      data: null,
    };
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

    return {
      status: 'success',
      message: 'Mật khẩu đã được cập nhật thành công.',
      data: null,
    };
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
        status: 'success',
        message: 'Đăng nhập Google thành công.',
        data: {
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
        },
      };
    } catch (error) {
      throw new BadRequestException('Đăng nhập với Google thất bại.');
    }
  }

  async verifyForgotPasswordOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;
    this.logger.log(`Verifying OTP for email: ${email}`);

    const data = await this.redisService.get(email);
    if (!data) {
      throw new BadRequestException('OTP không hợp lệ hoặc đã hết hạn.');
    }

    const { otp: storedOtp } = JSON.parse(data);
    const isOtpMatching = await bcrypt.compare(otp, storedOtp);

    if (!isOtpMatching) {
      throw new BadRequestException('Mã OTP không đúng.');
    }

    await this.redisService.del(email);

    return {
      status: 'success',
      message: 'Xác minh OTP thành công. Bạn có thể đặt lại mật khẩu.',
      data: null,
    };
  }
}
