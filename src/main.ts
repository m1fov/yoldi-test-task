import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import * as fs from "fs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    credentials: true,
    methods: ["POST", "PUT", "GET"],
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Yoldi Agency API")
    .setDescription("API к тестовому заданию от Yoldi Agency. Telegram: @m1fov")
    .setVersion("1.0")
    .addApiKey(
      { type: "apiKey", name: "authorization", in: "header" },
      "Api-Key",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
