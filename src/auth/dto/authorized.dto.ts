import { ApiProperty } from "@nestjs/swagger";

export class AuthorizedDto {
  @ApiProperty({
    description: "Индивидуальный идентификатор пользователя",
    required: true,
    type: Number,
  })
  id: number;
  @ApiProperty({
    description: "API статический токен",
    required: true,
    type: String,
  })
  token: string;
}
