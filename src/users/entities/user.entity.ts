import { Exclude } from 'class-transformer';
import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

@Table({
  tableName: 'users',
  timestamps: true,
})
export class UserModel extends Model {
  @PrimaryKey
  @Column({
    autoIncrement: true,
    type: DataType.BIGINT,
  })
  id: number

  @Column({
    field: 'firstName',
    type: DataType.STRING,
  })
  firstName: string

  @Column({
    field: 'lastName',
    type: DataType.STRING,
  })
  lastName: string

  @Column({unique: true,})
  email: string;

  @Column({
    field: 'password',
    type: DataType.STRING,
  })
  @Exclude({ toPlainOnly: true })
  password: string

  @Column({
    field: 'isLoginWithFacebook',
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  isLoginWithFacebook:boolean;

  @Column({
    field: 'isActive',
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  isActive:boolean;

  @Column({
    field: 'token',
    type: DataType.TEXT
  })
  token: string

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt: Date

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt: Date  
}
