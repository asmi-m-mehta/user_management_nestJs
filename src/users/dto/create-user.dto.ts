import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(1)
  firstName: string
  lastName: string
  email: string
  password: string

  @IsOptional()
  @IsBoolean()
  isLoginWithFacebook:boolean

  @IsOptional()
  @IsBoolean()
  isActive:boolean
  
  token: string
}
