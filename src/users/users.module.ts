import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { usersProviders } from "./users.providers";
import { ImagesModule } from "../images/images.module";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [ImagesModule, DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
})
export class UsersModule {}
