import { dataSourceProvider, imagesRepositoryProvider } from "../constants";
import { DataSource } from "typeorm";
import { ImageEntity } from "./image.entity";

export const imagesProviders = [
  {
    provide: imagesRepositoryProvider,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ImageEntity),
    inject: [dataSourceProvider],
  },
];
