import { Pagination } from 'src/types/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './entities/user.entity';
export declare class UsersService {
    private readonly User;
    constructor(User: typeof UserModel);
    create(CreateUserDto: CreateUserDto): Promise<UserModel>;
    findAll(query: Pagination): Promise<UserModel[]>;
    countAll(): Promise<number>;
    search(term: string): Promise<UserModel[]>;
    findOne(where: any, showPassword?: boolean): Promise<UserModel>;
    update(User: UserModel, UpdateUserDto: UpdateUserDto): Promise<UserModel>;
    remove(existingUser: UserModel): Promise<void>;
    authenticateUser(email: string, password: string): Promise<boolean | UserModel>;
}
