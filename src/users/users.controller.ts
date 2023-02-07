import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { EditDto } from "./dto/edit.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ProfileDto } from "./dto/profile.dto";
import { UserDto } from "./dto/user.dto";
import { ApiImplicitParam } from "@nestjs/swagger/dist/decorators/api-implicit-param.decorator";
import { UsersService } from "./users.service";
@ApiTags("Users")
@Controller({
  path: "users",
  version: "1",
})
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Put(":id/edit")
  @ApiOperation({ summary: "Редактирование профиля пользователя" })
  @ApiSecurity("Api-Key")
  @ApiImplicitParam({
    name: "id",
    description: "Индивидуальный идентификатор пользователя",
  })
  @ApiResponse({
    status: 200,
    description: "Информация успешно обновлена",
  })
  @ApiResponse({
    status: 401,
    description: "Нет доступа",
  })
  @ApiResponse({
    status: 404,
    description: "Пользователь не найден",
  })
  @ApiResponse({
    status: 409,
    description: "Данный URN уже занят",
  })
  @ApiResponse({
    status: 500,
    description: "Запрос закончился исключением",
  })
  async edit(
    @Param() params: { id: string },
    @Body() dto: EditDto,
    @Res() res,
  ) {
    const id = parseInt(params.id);
    const urnBusy = await this.usersService.urnBusy(id, dto.urn);

    if (urnBusy) {
      res.status(HttpStatus.CONFLICT).send();
    } else {
      const user = await this.usersService.findById(id);

      if (!user) {
        res.status(HttpStatus.NOT_FOUND).send();
      } else {
        await this.usersService.edit(user, dto.name, dto.aboutMe, dto.urn);

        res.status(HttpStatus.OK).send();
      }
    }
  }

  @Post(":id/photo")
  @ApiImplicitParam({
    name: "id",
    description: "Индивидуальный идентификатор пользователя",
  })
  @ApiOperation({ summary: "Обновление аватара пользователя" })
  @ApiSecurity("Api-Key")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Аватар для пользователя успешно обновлён",
  })
  @ApiResponse({
    status: 401,
    description: "Нет доступа",
  })
  @ApiResponse({
    status: 404,
    description: "Пользователь не найден",
  })
  @ApiResponse({
    status: 500,
    description: "Запрос закончился исключением",
  })
  @UseInterceptors(FileInterceptor("file"))
  async updatePhoto(
    @Param() params: { id: string },
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" })],
      }),
    )
    file: Express.Multer.File,
    @Res() res,
  ) {
    const id = parseInt(params.id);
    const success = await this.usersService.updatePhoto(id, file);

    if (success) {
      res.status(HttpStatus.OK).send();
    } else {
      res.status(HttpStatus.NOT_FOUND).send();
    }
  }

  @Post(":id/banner")
  @ApiImplicitParam({
    name: "id",
    description: "Индивидуальный идентификатор пользователя",
  })
  @ApiOperation({ summary: "Обновление баннера пользователя" })
  @ApiSecurity("Api-Key")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Баннер для пользователя успешно обновлён",
  })
  @ApiResponse({
    status: 401,
    description: "Нет доступа",
  })
  @ApiResponse({
    status: 404,
    description: "Пользователь не найден",
  })
  @ApiResponse({
    status: 500,
    description: "Запрос закончился исключением",
  })
  @UseInterceptors(FileInterceptor("file"))
  async updateBanner(
    @Param() params: { id: string },
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" })],
      }),
    )
    file: Express.Multer.File,
    @Res() res,
  ) {
    const id = parseInt(params.id);
    const success = await this.usersService.updateBanner(id, file);

    if (success) {
      res.status(HttpStatus.OK).send();
    } else {
      res.status(HttpStatus.NOT_FOUND).send();
    }
  }

  @Get("profile/:urn")
  @ApiImplicitParam({
    name: "urn",
    description: "Персональный URN пользователя",
  })
  @ApiOperation({
    summary: "Получение профиля пользователя по его персональной urn",
  })
  @ApiSecurity("Api-Key")
  @ApiResponse({
    status: 200,
    description: "Информация о пользователе успешно получена",
    type: ProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: "Нет доступа",
  })
  @ApiResponse({
    status: 404,
    description: "Пользователь не найден",
  })
  @ApiResponse({
    status: 500,
    description: "Запрос закончился исключением",
  })
  async getProfile(@Param() params: { urn: string }, @Res() res) {
    const user = await this.usersService.findByURN(params.urn);

    if (!user) {
      res.status(HttpStatus.NOT_FOUND).send();
    } else {
      const profile = await this.usersService.getProfile(user);

      res.status(HttpStatus.OK).send(profile);
    }
  }

  @Get()
  @ApiOperation({ summary: "Получение списка пользователей" })
  @ApiSecurity("Api-Key")
  @ApiResponse({
    status: 200,
    description: "Информация о пользователях успешно получена",
    type: UserDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: "Нет доступа",
  })
  @ApiResponse({
    status: 500,
    description: "Запрос закончился исключением",
  })
  async getUsers(@Res() res) {
    const users = await this.usersService.all();
    res.status(HttpStatus.OK).send(users);
  }
}
