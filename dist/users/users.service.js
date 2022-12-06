"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(User) {
        this.User = User;
    }
    async create(CreateUserDto) {
        const user = new this.User();
        Object.assign(user, CreateUserDto);
        await user.save();
        return await user.reload();
    }
    async findAll(query) {
        const offset = (query.page - 1) * query.perPage;
        const users = await this.User.findAll({ offset, limit: query.perPage });
        return users;
    }
    async countAll() {
        const total = await this.User.count();
        return total;
    }
    async search(term) {
        return await this.User.findAll({
            where: {
                name: {
                    [sequelize_2.Op.like]: `%${term}%`,
                },
            },
            limit: 20,
        });
    }
    async findOne(where, showPassword = false) {
        const users = await this.User.findOne({
            attributes: { exclude: showPassword ? ['createdAt', 'updatedAt'] : ['password', 'createdAt', 'updatedAt'] },
            where: where
        });
        return users;
    }
    async update(User, UpdateUserDto) {
        Object.assign(User, UpdateUserDto);
        await User.save();
        return await User.reload();
    }
    async remove(existingUser) {
        return await existingUser.destroy();
    }
    async authenticateUser(email, password) {
        const user = await this.User.findOne({ where: { email: email } });
        if (user) {
            let result = await bcrypt.compare(password, user.password);
            return result;
        }
        return user;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_entity_1.UserModel)),
    __metadata("design:paramtypes", [Object])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map