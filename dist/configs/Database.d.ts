import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';
export declare class DatabaseConnectionService implements SequelizeOptionsFactory {
    createSequelizeOptions(): SequelizeModuleOptions;
}
