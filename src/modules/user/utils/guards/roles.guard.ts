import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Không yêu cầu vai trò cụ thể
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = request.headers.authorization?.split(' ')[1];

    // Kiểm tra xem token có được cung cấp hay không
    if (!token) {
      response.status(401).json({
        status: 'error',
        message: 'Token không được cung cấp. Vui lòng đăng nhập.',
        data: null,
      });
      return false;
    }

    try {
      // Giải mã token
      const user = this.jwtService.verify(token);

      // Kiểm tra vai trò của người dùng
      if (!requiredRoles.includes(user.role)) {
        response.status(403).json({
          status: 'error',
          message: `User với vai trò '${user.role}' không có quyền truy cập.`,
          data: null,
        });
        return false;
      }

      return true;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        response.status(401).json({
          status: 'error',
          message: 'Token không hợp lệ hoặc đã hết hạn.',
          data: null,
        });
      } else {
        response.status(500).json({
          status: 'error',
          message: 'Đã có lỗi xảy ra trong quá trình xác thực.',
          data: null,
        });
      }
      return false;
    }
  }
}
