import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column({
    type: "varchar",
    length: 20,
  })
  name: string;

  @Column({
    type: "varchar",
  })
  email: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  aboutMe: string;

  @Column({
    type: "varchar",
  })
  passwordHash: string;

  @Column({
    type: "varchar",
  })
  photoKey: string;

  @Column({
    type: "varchar",
  })
  bannerKey: string;

  @Column({
    type: "varchar",
  })
  urn: string;
}
