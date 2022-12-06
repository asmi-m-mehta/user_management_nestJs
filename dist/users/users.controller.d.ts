import { ResponseProvider } from '../providers/ResponseProvider';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { HttpService } from '@nestjs/axios';
export declare class UsersController {
    private readonly usersService;
    private readonly responseProvider;
    private readonly authService;
    private readonly httpService;
    constructor(usersService: UsersService, responseProvider: ResponseProvider, authService: AuthService, httpService: HttpService);
    facebookLogin(): Promise<any>;
    facebookLoginRedirect(req: any): Promise<any>;
    logout(id: number): Promise<{
        message: string;
        payload: any;
    }>;
    create(CreateUserDto: CreateUserDto): Promise<{
        message: string;
        payload: any;
    }>;
    findAll(perPage: number, page: number): Promise<{
        message: string;
        payload: any;
    }>;
    homePage(id: number): Promise<{
        message: string;
        payload: any;
    }>;
    findOne(id: number): Promise<{
        message: string;
        payload: any;
    }>;
    update(id: number, UpdateUserDto: UpdateUserDto): Promise<{
        message: string;
        payload: any;
    }>;
    remove(id: number): Promise<{
        message: string;
        payload: any;
    }>;
    login(LoginDto: LoginDto): Promise<{
        message: string;
        payload: any;
    }>;
}
