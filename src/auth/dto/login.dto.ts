import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginDto {
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
    minLength: 5,
  })
  password: string;
}
