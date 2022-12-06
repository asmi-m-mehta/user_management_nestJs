import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UserModel } from './entities/user.entity'
import { UsersController } from './users.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { ResponseProvider } from '../providers/ResponseProvider'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { AuthService } from '../auth/auth.service'
import { JwtService } from '@nestjs/jwt';
import { FacebookStrategy } from '../auth/facebook.strategy'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [SequelizeModule.forFeature([UserModel]), HttpModule],
  controllers: [UsersController],
  providers: [UsersService, ResponseProvider, AuthService, JwtService, FacebookStrategy],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'users/:id', method: RequestMethod.GET },
        { path: 'users/:id', method: RequestMethod.DELETE },
        { path: 'users', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.GET },
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users/facebookLogin', method: RequestMethod.GET },
        { path: 'users/facebookLogin/redirect', method: RequestMethod.GET },
      )
      .forRoutes(UsersController)
  }
}
