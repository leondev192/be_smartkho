// src/modules/user/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'leovn.asia@gmail.com',
    description: 'Email của người dùng',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'temporaryPassword',
    description: 'Mật khẩu tạm thời',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên đầy đủ',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    example:
      'https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-1024.png',
    description: 'Đường dẫn đến ảnh đại diện',
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại của người dùng',
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({
    example: '123 Đường ABC, Quận 1, TP.HCM',
    description: 'Địa chỉ của người dùng',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    enum: RoleEnum,
    description: 'Vai trò của người dùng (ADMIN hoặc WAREHOUSE_STAFF)',
  })
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: RoleEnum;
}

export class UpdateUserDto {
  @ApiProperty({
    example: 'leovn.asia@gmail.com',
    description: 'Email của người dùng',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên đầy đủ',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Đường dẫn đến ảnh đại diện',
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại của người dùng',
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({
    example: '123 Đường ABC, Quận 1, TP.HCM',
    description: 'Địa chỉ của người dùng',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    enum: RoleEnum,
    description: 'Vai trò của người dùng (ADMIN hoặc WAREHOUSE_STAFF)',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: RoleEnum;
}
