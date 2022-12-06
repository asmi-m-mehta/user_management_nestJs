import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  BadRequestException,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  Req,
  Request,
  HttpException
} from '@nestjs/common'
import { ResponseProvider } from '../providers/ResponseProvider'
import { UsersService } from './users.service'
import { AuthService } from '../auth/auth.service'
import { Pagination } from '../types/types'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { LoginDto } from './dto/login.dto'
import { hashPassword } from '../helpers/data.helpers'
import { AuthGuard } from "@nestjs/passport";
import { HttpService } from '@nestjs/axios'
import axios, { AxiosError } from 'axios'
import { catchError, firstValueFrom } from 'rxjs'
import { UserModel } from './entities/user.entity'

interface AuthResponse<T = never> {
  message: string
  payload?: T
  statusCode?: number
  timestamp?: Date
  path?: string
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly responseProvider: ResponseProvider,
    private readonly authService: AuthService,
    private readonly httpService: HttpService
  ) {}

  @Get("/facebookLogin")
  @UseGuards(AuthGuard("facebook"))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get("/facebookLogin/redirect")
  @UseGuards(AuthGuard("facebook"))
  async facebookLoginRedirect(@Req() req): Promise<any> {
    
    let user = {}
    if(req.hasOwnProperty('user')) {
      let requestUser = req.user.user;
      
      let email = requestUser.email;
      let access_token = req.user.accessToken;

      const existingUser = await this.usersService.findOne( {email: email} )

      let CreateUserDto = <CreateUserDto>{};
      CreateUserDto.firstName = requestUser.firstName || '';
      CreateUserDto.lastName = requestUser.lastName || '';
      CreateUserDto.email = email || '';
      CreateUserDto.token = access_token;
      CreateUserDto.isLoginWithFacebook = true;
      
      if(existingUser) {
        user = await this.usersService.update(existingUser, CreateUserDto)
      } else {        
        user = await this.usersService.create(CreateUserDto)
      }
    }

    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }  

  @Put('/logout')
  async logout(@Body('id', ParseIntPipe) id: number) {

    const existingUser = await this.usersService.findOne( {'id': id} )
    await this.usersService.update(
      existingUser,
      { token: null }
    )
    
    return this.responseProvider.success('User logged out successfully.', true);
  }  

  @Post()
  async create(
    @Body() CreateUserDto: CreateUserDto,
  ) {
    CreateUserDto.firstName = CreateUserDto.firstName.toLocaleLowerCase()
    CreateUserDto.lastName = CreateUserDto.lastName.toLocaleLowerCase()
    CreateUserDto.email = CreateUserDto.email.toLocaleLowerCase()
    CreateUserDto.password = await hashPassword(CreateUserDto.password)

    const existingUser = await this.usersService.findOne({ email: CreateUserDto.email })
    if (existingUser) {
      throw new BadRequestException('User Already exists.')
    }
    let user = await this.usersService.create(CreateUserDto)
    
    let authenticatedData = await this.authService.login(user);
    await this.usersService.update(
      user,
      { token: authenticatedData.access_token }
    )
    return this.responseProvider.success('User created successfully.', user)
  }

  @Get()
  async findAll(
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    const pagination: Pagination = {
      page: page || 1,
      perPage: perPage || 10,
    }
    const users = await this.usersService.findAll(pagination)
    const totalRecords = await this.usersService.countAll()
    const numberOfPages = Math.ceil(totalRecords / pagination.perPage)
    return this.responseProvider.success('ok', {
      users,
      totalRecords,
      numberOfPages,
    })
  }

  @Post('/homePage')
  async homePage(@Body('id', ParseIntPipe) id: number) {
    let user = await this.usersService.findOne( {'id': id} )
    if (!user) {
      throw new NotFoundException('User not found.')
    }
    if(user.isLoginWithFacebook) {
      const { data } = await firstValueFrom(
        this.httpService
          .get<AuthResponse<UserModel>>('https://graph.facebook.com/me?access_token=' + user.token)
          .pipe(
            catchError((error: Error | AxiosError<AuthResponse>) => {
              if (axios.isAxiosError(error) && error.response) {
                const apiError = error as AxiosError<AuthResponse>
  
                const {
                  status,
                  data: { message },
                } = apiError.response
  
                throw new HttpException({ message }, status)
              }
  
              const { message } = error
  
              throw new HttpException(
                { message },
                HttpStatus.INTERNAL_SERVER_ERROR,
              )
            }),
          ),
      )
      
      return this.responseProvider.success('ok', data)
    }
    return this.responseProvider.success('ok', user)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne( {'id': id} )
    if (!user) {
      throw new NotFoundException('User not found.')
    }
    return this.responseProvider.success('ok', user)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateUserDto: UpdateUserDto    
  ) {
    const existingUser = await this.usersService.findOne( {'id': id} )
    if (!existingUser) {
      throw new NotFoundException('User not found.')
    }

    const updatedUser = await this.usersService.update(
      existingUser,
      UpdateUserDto
    )
    return this.responseProvider.success(
      'User updated successfully.',
      updatedUser,
    )
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const existingUser = await this.usersService.findOne( {'id': id} )
    if (!existingUser) {
      throw new NotFoundException('User not found.')
    }

    this.usersService.remove(existingUser)
    return this.responseProvider.success('User deleted successfully.', {})
  }

  @Post('login')
  async login(@Body() LoginDto: LoginDto) {
    LoginDto.email = LoginDto.email.toLocaleLowerCase()
    LoginDto.password = LoginDto.password
    
    const user = await this.authService.validateUser(LoginDto.email, LoginDto.password);
    
    if(user) {
      let authenticatedData = await this.authService.login(user);

      const existingUser = await this.usersService.findOne( {'id': user.id} )
      await this.usersService.update(
        existingUser,
        { token: authenticatedData.access_token }
      )

      return this.responseProvider.success('User logged in successfully.', authenticatedData);
    } else {
      return this.responseProvider.success('Unauthenticated user.', false);
    }
  } 
}
