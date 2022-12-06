import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { DatabaseConnectionService } from './configs/Database'
import { ResponseProvider } from './providers/ResponseProvider'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule    
  ],
  controllers: [AppController],
  providers: [ResponseProvider],
})
export class AppModule {}

