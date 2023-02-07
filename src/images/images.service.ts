import { Inject, Injectable } from "@nestjs/common";
import { imagesRepositoryProvider } from "../constants";
import { Repository } from "typeorm";
import { ImageEntity } from "./image.entity";
import * as fs from "fs";

@Injectable()
export class ImagesService {
  constructor(
    @Inject(imagesRepositoryProvider)
    private imagesRepository: Repository<ImageEntity>,
  ) {}

  /** Добавление картинки */
  async createImage(file: Express.Multer.File): Promise<string> {
    const timestamp = Math.trunc(Date.now() / 1000),
      fileName = timestamp.toString() + "_" + file.originalname.toLowerCase();

    const imageEntity = this.imagesRepository.create({
      key: timestamp.toString() + "_" + file.mimetype.replace("image/", ""),
      fileName,
    });

    fs.writeFileSync("./images/" + fileName, file.buffer);

    await this.imagesRepository.save([imageEntity]);

    return imageEntity.key;
  }

  /** Поиск картинки по ключу */
  async findOne(imageKey: string): Promise<string | undefined> {
    const image = await this.imagesRepository.findOne({
      where: {
        key: imageKey,
      },
    });

    if (!image) return undefined;

    return image.fileName;
  }
}
