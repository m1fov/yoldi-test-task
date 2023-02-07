import {
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { Controller, Get, HttpStatus, Param, Res } from "@nestjs/common";
import * as fs from "fs";
import { ApiImplicitParam } from "@nestjs/swagger/dist/decorators/api-implicit-param.decorator";
import { ImagesService } from "./images.service";

@ApiTags("Images")
@Controller({
  path: "images",
  version: "1",
})
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Get(":imageKey")
  @ApiOperation({ summary: "Получение картинки по ключу" })
  @ApiSecurity("Api-Key")
  @ApiImplicitParam({ name: "imageKey", description: "Ключ фото" })
  @ApiResponse({
    status: 200,
    description: "Информация успешно обновлена",
    schema: {
      type: "string",
      format: "binary",
    },
  })
  @ApiProduces("image/*")
  @ApiResponse({
    status: 401,
    description: "Нет доступа",
  })
  @ApiResponse({
    status: 404,
    description: "Картинка не найдена",
  })
  @ApiResponse({
    status: 500,
    description: "Запрос закончился исключением",
  })
  async getImage(@Res() res, @Param("imageKey") imageKey: string) {
    const imageName = await this.imagesService.findOne(imageKey);

    if (!imageName) return res.status(HttpStatus.NOT_FOUND).send();

    const image = fs.readFileSync(`./images/${imageName}`);

    res.contentType("image/*");
    res.status(HttpStatus.OK).send(image);
  }
}
