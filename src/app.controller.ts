import { Controller, Get } from '@nestjs/common'
import { ResponseProvider } from './providers/ResponseProvider'

@Controller()
export class AppController {
  constructor(private readonly responseProvider: ResponseProvider) {}

  @Get()
  getHello() {
    return this.responseProvider.success('Welcome to the user management 🚀')
  }
}
