import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy JWT từ header Authorization
      ignoreExpiration: false, // Token hết hạn thì từ chối
      secretOrKey: process.env.JWT_SECRET, // Secret key từ biến môi trường
    });
  }

  async validate(payload: any) {
    // Trả về thông tin user sau khi token được xác thực
    return { userId: payload.sub, email: payload.email, role_id: payload.role_id };
  }
}
