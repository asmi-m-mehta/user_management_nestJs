import { Model } from 'sequelize-typescript';
export declare class UserModel extends Model {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isLoginWithFacebook: boolean;
    isActive: boolean;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}
