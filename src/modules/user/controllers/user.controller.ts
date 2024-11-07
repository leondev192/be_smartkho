import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { RolesGuard } from '../utils/guards/roles.guard';
import { Roles } from '../utils/decorators/roles.decorator';
import { RoleEnum } from '@prisma/client';

@ApiTags('User Management')
@Controller('users')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user (Admin or Warehouse Staff)' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @Roles(RoleEnum.ADMIN) // Chỉ Admin mới có quyền tạo người dùng mới
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ status: string; message: string; data?: any }> {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({ status: 200, description: 'Successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Roles(RoleEnum.ADMIN) // Chỉ Admin mới có quyền cập nhật người dùng
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ status: string; message: string; data?: any }> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Roles(RoleEnum.ADMIN) // Chỉ Admin mới có quyền xóa người dùng
  async deleteUser(
    @Param('id') id: string,
  ): Promise<{ status: string; message: string; data?: any }> {
    return this.userService.deleteUser(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users.' })
  @Roles(RoleEnum.ADMIN) // Chỉ Admin mới có quyền xem danh sách người dùng
  async getAllUsers(): Promise<{
    status: string;
    message: string;
    data: any[];
  }> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User information.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Roles(RoleEnum.ADMIN, RoleEnum.WAREHOUSE_STAFF) // Cả Admin và Warehouse Staff đều có thể xem chi tiết người dùng
  async getUserById(
    @Param('id') id: string,
  ): Promise<{ status: string; message: string; data?: any }> {
    return this.userService.getUserById(id);
  }
}
