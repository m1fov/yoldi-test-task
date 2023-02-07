import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("images")
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
  })
  key: string;

  @Column({
    type: "varchar",
  })
  fileName: string;
}
