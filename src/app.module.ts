import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ImagesModule } from "./images/images.module";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { AuthenticationMiddleware } from "./auth/auth.middleware";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ImagesModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        { path: "v1/auth/login", method: RequestMethod.POST },
        { path: "v1/auth/registration", method: RequestMethod.POST },
      )
      .forRoutes("*");
  }
}
