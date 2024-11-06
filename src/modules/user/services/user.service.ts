import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { EmailService } from './email.service'; // Import Email Service để gửi email

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  private createResponse(status: string, message: string, data?: any) {
    return {
      status,
      message,
      data,
    };
  }

  generateRandomPassword(): string {
    return Math.random().toString(36).slice(-8);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, fullName, role, avatarUrl, phoneNumber, address } =
      createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return this.createResponse(
        'error',
        'Tài khoản với email này đã tồn tại.',
      );
    }

    const password = this.generateRandomPassword();
    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        avatarUrl,
        phoneNumber,
        address,
        role,
      },
    });

    await this.emailService.sendPasswordEmail(email, password);
    return this.createResponse('success', 'Tạo tài khoản thành công.', newUser);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const { email, fullName, role, avatarUrl, phoneNumber, address } =
      updateUserDto;

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          email,
          fullName,
          avatarUrl,
          phoneNumber,
          address,
          role,
        },
      });
      return this.createResponse(
        'success',
        'Cập nhật thông tin người dùng thành công.',
        updatedUser,
      );
    } catch (error) {
      return this.createResponse('error', 'Người dùng không tồn tại.');
    }
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      return this.createResponse('error', 'Người dùng không tồn tại.');
    }

    await this.prisma.user.delete({ where: { id } });
    return this.createResponse('success', 'Người dùng đã được xóa thành công.');
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return this.createResponse(
      'success',
      'Lấy danh sách người dùng thành công.',
      users,
    );
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      return this.createResponse('error', 'Người dùng không tồn tại.');
    }
    return this.createResponse(
      'success',
      'Lấy thông tin người dùng thành công.',
      user,
    );
  }
}
