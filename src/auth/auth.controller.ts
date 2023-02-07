import { Controller, Post, Body, Res, HttpStatus } from "@nestjs/common";
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { RegistrationDto } from "./dto/registration.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthorizedDto } from "./dto/authorized.dto";
import { AuthService } from "./auth.service";
@ApiTags("Authorization")
@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post("registration")
  @ApiOperation({ summary: "Регистрация пользователя" })
  @ApiResponse({
    status: 200,
    description: "Пользователь успешно создан.",
    type: AuthorizedDto,
  })
  @ApiResponse({
    status: 409,
    description: "Данный почтовый адрес уже занят.",
  })
  @ApiResponse({
    status: 500,
    description: "Запрос закончился исключением",
  })
  async registration(@Body() dto: RegistrationDto, @Res() res) {
    const authorizedDto = await this.authService.registration(dto);

    if (!authorizedDto) {
      res.status(HttpStatus.CONFLICT).send();
    } else {
      res.status(HttpStatus.OK).send(authorizedDto);
    }
  }

  @Post("login")
  @ApiOperation({ summary: "Авторизация пользователя" })
  @ApiResponse({
    status: 200,
    description: "Успешно авторизован.",
    type: AuthorizedDto,
  })
  @ApiResponse({
    status: 401,
    description: "Пользователь с такими данными не был найден.",
  })
  @ApiResponse({
    status: 500,
    description: "Запрос закончился исключением",
  })
  async login(@Body() dto: LoginDto, @Res() res) {
    const authorizedDto = await this.authService.login(dto);

    if (!authorizedDto) {
      res.status(HttpStatus.UNAUTHORIZED).send();
    } else {
      res.status(HttpStatus.OK).send(authorizedDto);
    }
  }

  @Post("exit")
  @ApiOperation({ summary: "Выход пользователя" })
  @ApiSecurity("Api-Key")
  @ApiResponse({
    status: 200,
    description: "Выход успешно выполнен.",
  })
  @ApiResponse({
    status: 401,
    description: "Пользователь не авторизован.",
  })
  @ApiResponse({
    status: 500,
    description: "Запрос закончился исключением",
  })
  async exit(@Res() res) {
    /* Авторизация должна быть двух-токеновая? Сколько времени жизни основного токена? И если двух-токеновая, сколько жизнь refresh токена?
     * Можно сделать просто статический API-key без времени жизни и тд. Не JWT
     * - При таком раскладе метод оказался фиктивным */
    res.status(HttpStatus.OK).send();
  }
}
