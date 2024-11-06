import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { TransactionModule } from './modules/transaction/transaction.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api/v1');

  // Tạo tài liệu Swagger cho Admin
  const adminConfig = new DocumentBuilder()
    .setTitle('Admin API')
    .setDescription('API documentation for admin')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
    include: [AuthModule, UserModule, ProductModule, TransactionModule],
  });
  SwaggerModule.setup('api', app, adminDocument);

  await app.listen(3000);
}
bootstrap();
