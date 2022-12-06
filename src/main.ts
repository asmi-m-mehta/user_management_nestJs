import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotEnv from 'dotenv'
dotEnv.config()



async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  
  //get port from config service which gets from .env file
  const configService = app.get(ConfigService)
  const port = configService.get('APP_PORT')
  await app.listen(port)
  console.log(`🚀 on port : ${port}`)
}
bootstrap()
