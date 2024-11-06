import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, otp: string) {
    try {
      await this.transporter.sendMail({
        from: `"Hệ thống khách sạn Moka Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Xác Thực Tài Khoản - Hệ thống khách sạn Moka',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Chào mừng bạn đến với Hệ thống khách sạn Moka!</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản trên nền tảng của chúng tôi. Để hoàn tất đăng ký, vui lòng sử dụng mã OTP dưới đây:</p>
            <h3 style="color: #FF4E33;">${otp}</h3>
            <p><strong>Lưu ý:</strong> Mã xác thực này có hiệu lực trong 5 phút. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
            <p>Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi qua email này.</p>
            <p>Trân trọng,</p>
            <p>Đội ngũ Hệ thống khách sạn Moka</p>
          </div>
        `,
      });
      console.log(`Email sent successfully to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Không thể gửi email xác thực.');
    }
  }

  async sendForgotPasswordEmail(email: string, otp: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Hệ thống khách sạn Moka Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Quên Mật Khẩu - Hệ thống khách sạn Moka',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Yêu cầu đặt lại mật khẩu</h2>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nếu đây là bạn, vui lòng sử dụng mã OTP sau để đặt lại mật khẩu:</p>
            <h3 style="color: #FF4E33;">${otp}</h3>
            <p><strong>Lưu ý:</strong> Mã này có hiệu lực trong 5 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi ngay lập tức.</p>
            <p>Nếu cần hỗ trợ thêm, đừng ngần ngại liên hệ chúng tôi.</p>
            <p>Trân trọng,</p>
            <p>Đội ngũ Hệ thống khách sạn Moka</p>
          </div>
        `,
      });
      console.log('Email OTP đã được gửi.');
    } catch (error) {
      console.error('Gửi email thất bại:', error);
      throw new Error('Không thể gửi email OTP.');
    }
  }
}