import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerService {
  static setup(app: INestApplication): void {
    // Regular API Documentation
    const regularConfig = new DocumentBuilder()
      .setTitle('Sky Trips API')
      .setDescription('Sky Trips Backend API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const regularDocument = SwaggerModule.createDocument(app, regularConfig);
    SwaggerModule.setup('docs', app, regularDocument, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    // Admin API Documentation
    const adminConfig = new DocumentBuilder()
      .setTitle('Sky Trips Admin API')
      .setDescription('Sky Trips Backend Admin API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const adminDocument = SwaggerModule.createDocument(app, adminConfig);
    SwaggerModule.setup('admin/docs', app, adminDocument, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }
}
