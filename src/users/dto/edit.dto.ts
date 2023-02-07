import { ApiProperty } from "@nestjs/swagger";

export class EditDto {
  @ApiProperty({
    description: "Имя пользователя",
    required: true,
    type: String,
    minLength: 1,
    maxLength: 20,
  })
  name: string;
  @ApiProperty({
    description: "Описание профиля",
    required: true,
    type: String,
    minLength: 0,
    maxLength: 255,
  })
  aboutMe: string;
  @ApiProperty({
    description: "URN пользователя",
    required: true,
    type: String,
    minLength: 0,
    maxLength: 10,
  })
  urn: string;
}
