import { Injectable } from '@nestjs/common'
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize'

import { UserModel } from '../users/entities/user.entity'

@Injectable()
export class DatabaseConnectionService implements SequelizeOptionsFactory {
  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      dialectOptions: {
        decimalNumbers: true,
      },
      synchronize: false,
      logging: true,
      autoLoadModels: true,
      models: [
        UserModel,
      ],
    }
  }
}
