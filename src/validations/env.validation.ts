import { plainToClass } from 'class-transformer'
import {
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator'

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment

  @IsNumber()
  APP_PORT: number

  @IsString()
  DB_HOST: string

  @IsString()
  DB_USERNAME: string

  @IsString()
  DB_PASSWORD: string

  @IsString()
  DB_DATABASE: string

  @IsNumber()
  DB_PORT: number

  @IsString()
  ALLOW_ORIGIN_ENV: string

  @IsUrl()
  AUTH_URL: string
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  let errorMessage = errors
    .map((message) => message.constraints[Object.keys(message.constraints)[0]])
    .join('\n')

  const COLOR = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    fgRed: '\x1b[31m',
  }

  errorMessage = `${COLOR.fgRed}${COLOR.bright}${errorMessage}${COLOR.reset}`

  if (errors.length > 0) {
    throw new Error(errorMessage)
  }

  return validatedConfig
}
