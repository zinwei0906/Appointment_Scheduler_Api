import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import redoc from 'redoc-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Appointment API')
    .setDescription('Appointment system API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.use(
    '/docs',
    redoc({
      title: 'API Docs',
      specUrl: '/swagger-json',
    }),
  );

  app.getHttpAdapter().get('/swagger-json', (req, res) => {
    res.json(document);
  });

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`\n`);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`🚀 Swagger UI running on http://localhost:${port}/swagger`);
  console.log(`🚀 ReDoc running on http://localhost:${port}/docs`);
}
bootstrap();
