// auth.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'leovn.asia@gmail.com', description: 'Email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'vsmt9g37', description: 'Mật khẩu' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'leovn.asia@gmail.com',
    description: 'Email đã đăng ký',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
export class VerifyOtpDto {
  @ApiProperty({
    example: 'leovn.asia@gmail.com',
    description: 'Email đã đăng ký',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'Mã OTP để xác thực' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
export class ResetPasswordDto {
  @ApiProperty({
    example: 'resetToken123',
    description: 'Token đặt lại mật khẩu',
  })
  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @ApiProperty({ example: 'newPassword123', description: 'Mật khẩu mới' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class GoogleLoginDto {
  @ApiProperty({
    example: 'google-id-token',
    description: 'ID Token từ Google',
  })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
