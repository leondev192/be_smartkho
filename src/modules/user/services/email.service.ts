import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false, // Nếu sử dụng SSL thì đặt là true
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Gửi email thông báo mật khẩu cho người dùng
  async sendPasswordEmail(email: string, password: string) {
    try {
      await this.transporter.sendMail({
        from: `"Hệ thống SmartKho" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Tài khoản của bạn đã được tạo - Hệ thống SmartKho',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Xin chào,</h2>
            <p>Tài khoản của bạn đã được quản trị viên tạo trên Hệ thống SmartKho. Bạn có thể sử dụng thông tin dưới đây để đăng nhập:</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mật khẩu:</strong> ${password}</p>
            <p><strong>Lưu ý:</strong> Vui lòng đăng nhập và đổi mật khẩu ngay sau lần đăng nhập đầu tiên để đảm bảo tính bảo mật cho tài khoản của bạn.</p>
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.</p>
            <p>Trân trọng,</p>
            <p>Đội ngũ Hệ thống SmartKho</p>
          </div>
        `,
      });
      console.log(`Password email sent successfully to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Không thể gửi email chứa mật khẩu.');
    }
  }
}
