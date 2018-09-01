import { Entity, ObjectIdColumn, ObjectID, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectID;

  @Column()
  email!: string;

  @Column()
  password!: string;
}
