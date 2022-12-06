import { Module } from "@nestjs/common"
import { UsersModule } from "../users/users.module";
import { AuthService } from "./auth.service"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersService } from "../users/users.service";
import { LocalStrategy } from './local.auth';


@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({
    secret: process.env.JWT_TOKEN,
    signOptions: { expiresIn: '60s' },
  })],
  providers: [AuthService, UsersService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule { }