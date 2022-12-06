import {
    IsNotEmpty,
  } from 'class-validator'
  
  export class LoginDto {
    @IsNotEmpty()
    email: string
    password: string
  }
  