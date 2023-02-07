import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RegistrationDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "Имя пользователя",
    required: true,
    type: String,
    minLength: 1,
    maxLength: 20,
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "Электронный почтовый адрес",
    required: true,
    type: String,
    minLength: 5,
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "Пароль",
    required: true,
    type: String,
    minLength: 6,
    maxLength: 20,
  })
  password: string;
}
