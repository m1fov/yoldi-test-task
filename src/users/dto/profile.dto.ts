import { ApiProperty } from "@nestjs/swagger";

export class ProfileDto {
  @ApiProperty({
    description: "Имя пользователя",
    required: true,
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "Описание профиля",
    required: true,
    type: String,
  })
  aboutMe: string;

  @ApiProperty({
    description: "Электронный почтовый адрес",
    required: true,
    type: String,
  })
  email: string;

  @ApiProperty({
    description: "Ключ фото профиля",
    required: true,
    type: String,
  })
  photoKey: string;

  @ApiProperty({
    description: "Ключ баннера профиля",
    required: true,
    type: String,
  })
  bannerKey: string;
}
