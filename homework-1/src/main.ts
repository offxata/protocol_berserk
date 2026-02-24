import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './00-app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Banking Transactions API')
    .setDescription(
      'REST API for banking transactions using NestJS with Clean Architecture and SOLID principles',
    )
    .setVersion('1.0')
    .addTag('transactions', 'Transaction management endpoints')
    .addTag('accounts', 'Account balance and summary endpoints')
    .addTag('health', 'Health check endpoint')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api`);
}

bootstrap();
