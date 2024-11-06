// src/utils/email.util.ts
import { EmailService } from '../services/email.service';

export async function sendOtpEmail(email: string, otp: string) {
  const emailService = new EmailService();
  await emailService.sendVerificationEmail(email, otp);
}
