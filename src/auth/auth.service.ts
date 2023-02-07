import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { AuthorizedDto } from "./dto/authorized.dto";
import { UserEntity } from "../users/user.entity";
import { RegistrationDto } from "./dto/registration.dto";
import * as process from "process";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  /** Получение DTO авторизации */
  async getAuthorizedDto(userEntity: UserEntity): Promise<AuthorizedDto> {
    return {
      id: userEntity.uid,
      token: process.env.API_TOKEN,
    };
  }

  /** Авторизация пользователя */
  async login(dto: LoginDto): Promise<AuthorizedDto | undefined> {
    const userEntity = await this.usersService.findOne(dto.email, dto.password);

    if (!userEntity) return undefined;

    return await this.getAuthorizedDto(userEntity);
  }

  /** Регистрация пользователя */
  async registration(dto: RegistrationDto): Promise<AuthorizedDto | undefined> {
    const emailIsBusy = await this.usersService.emailBusy(dto.email);

    if (emailIsBusy) return undefined;

    const userEntity = await this.usersService.createUser(
      dto.name,
      dto.email,
      dto.password,
    );

    return await this.getAuthorizedDto(userEntity);
  }
}
