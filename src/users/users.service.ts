import { Inject, Injectable } from "@nestjs/common";
import { usersRepositoryProvider } from "../constants";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import * as bcrypt from "bcrypt";
import { ImagesService } from "../images/images.service";
import { ProfileDto } from "./dto/profile.dto";
import { UserDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(
    @Inject(usersRepositoryProvider)
    private usersRepository: Repository<UserEntity>,
    private imagesService: ImagesService,
  ) {}

  /** Создание регистрационного URN */
  async processURN(text: string): Promise<string> {
    return text.replace(/[^a-zA-Z0-9_]+/g, "_");
  }

  /** Проверка на занятость почтового ящика */
  async emailBusy(email: string): Promise<boolean> {
    const entities = await this.usersRepository.find({
      where: {
        email: email.toLowerCase(),
      },
    });

    return entities.length !== 0;
  }

  /** Создание хэша пароля */
  async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 16);
  }

  /** Сравнение пароля с хэшом */
  async compare(password: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }

  /** Создание сущности пользователя */
  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const passwordHash = await this.encryptPassword(password);
    const urn = await this.processURN(email);

    const user = this.usersRepository.create({
      name,
      email,
      passwordHash,
      urn,
      aboutMe: "",
      photoKey: "",
      bannerKey: "",
    });

    await this.usersRepository.save([user]);

    return user;
  }

  /** Поиск пользователя по соответствию почты и пароля */
  async findOne(
    email: string,
    password: string,
  ): Promise<UserEntity | undefined> {
    const userEntity = await this.usersRepository.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!userEntity) return undefined;

    const compare = await this.compare(password, userEntity.passwordHash);

    if (!compare) return undefined;

    return userEntity;
  }

  /** Изменение данных пользователя */
  async edit(
    userEntity: UserEntity,
    name: string,
    aboutMe: string,
    urn: string,
  ): Promise<void> {
    urn = await this.processURN(urn);

    userEntity.name = name;
    userEntity.aboutMe = aboutMe;
    userEntity.urn = urn;

    await this.usersRepository.save([userEntity]);
  }

  /** Получение всех списка всех юзеров */
  async all(): Promise<UserDto[]> {
    const userEntities = await this.usersRepository.find({}),
      users: UserDto[] = [];

    userEntities.forEach((el) => {
      users.push({
        name: el.name,
        photoKey: el.photoKey,
        email: el.email,
        urn: el.urn,
      });
    });

    return users;
  }

  async urnBusy(id: number, urn: string) {
    urn = await this.processURN(urn);

    const userEntity = await this.usersRepository.findOne({
      where: {
        urn,
      },
    });

    if (!userEntity) return false;
    return id !== userEntity.uid;
  }

  /** Поиск пользователя по ID */
  async findById(id: number): Promise<UserEntity | undefined> {
    const userEntity = await this.usersRepository.findOne({
      where: {
        uid: id,
      },
    });

    if (!userEntity) return undefined;

    return userEntity;
  }

  /** Поиск пользователя по URN */
  async findByURN(urn: string): Promise<UserEntity | undefined> {
    const userEntity = await this.usersRepository.findOne({
      where: {
        urn: urn,
      },
    });

    if (!userEntity) return undefined;

    return userEntity;
  }

  /** Получение профиля пользователя исходя из UserEntity */
  async getProfile(userEntity: UserEntity): Promise<ProfileDto> {
    return {
      name: userEntity.name,
      aboutMe: userEntity.aboutMe,
      email: userEntity.email,
      photoKey: userEntity.photoKey,
      bannerKey: userEntity.bannerKey,
    };
  }

  /** Обновление аватара пользователя */
  async updatePhoto(id: number, file: Express.Multer.File): Promise<boolean> {
    const user = await this.findById(id);

    if (!user) return false;

    user.photoKey = await this.imagesService.createImage(file);

    await this.usersRepository.save([user]);

    return true;
  }

  /** Обновление баннера пользователя */
  async updateBanner(id: number, file: Express.Multer.File): Promise<boolean> {
    const user = await this.findById(id);

    if (!user) return false;

    user.bannerKey = await this.imagesService.createImage(file);

    await this.usersRepository.save([user]);

    return true;
  }
}
