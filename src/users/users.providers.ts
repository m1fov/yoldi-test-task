import { DataSource } from "typeorm";
import { UserEntity } from "./user.entity";
import { dataSourceProvider, usersRepositoryProvider } from "../constants";

export const usersProviders = [
  {
    provide: usersRepositoryProvider,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: [dataSourceProvider],
  },
];
