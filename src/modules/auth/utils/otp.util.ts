// src/modules/auth/utils/otp.util.ts
import * as bcrypt from 'bcrypt';

// Tạo OTP 6 chữ số
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mã hóa OTP
export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

// So sánh OTP
export async function compareOtp(
  inputOtp: string,
  hashedOtp: string,
): Promise<boolean> {
  return bcrypt.compare(inputOtp, hashedOtp);
}
