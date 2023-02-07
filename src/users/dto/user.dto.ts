import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({
    description: "Имя пользователя",
    required: true,
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "Ключ фото профиля",
    required: true,
    type: String,
  })
  photoKey: string;

  @ApiProperty({
    description: "Электронный почтовый адрес",
    required: true,
    type: String,
  })
  email: string;

  @ApiProperty({
    description: "Персональный URN пользователя",
    required: true,
    type: String,
  })
  urn: string;
}
