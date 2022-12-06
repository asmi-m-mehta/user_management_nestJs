import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService, 
        private jwtService: JwtService) 
        { }
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOne({email: username}, true);
        if (!user) return null;
        
        if(user.isLoginWithFacebook) {
            throw new NotAcceptableException('User has been registered with facebook. So cannot login from here');
        }
        const passwordValid = await bcrypt.compare(password, user.password)
        if (user && passwordValid) {
            return user;
        }
        return null;
    }
    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        const options = {
            secret: process.env.JWT_TOKEN
        }
        return {
            ...user.dataValues,
            access_token: this.jwtService.sign(payload, options),
        };
    }

    async getUserByToken(token: string) {
        const user = await this.usersService.findOne({ token: token });
        if (!user) return null;
        return user;
    }
}