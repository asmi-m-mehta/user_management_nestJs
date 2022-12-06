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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const ResponseProvider_1 = require("../providers/ResponseProvider");
const users_service_1 = require("./users.service");
const auth_service_1 = require("../auth/auth.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const login_dto_1 = require("./dto/login.dto");
const data_helpers_1 = require("../helpers/data.helpers");
const passport_1 = require("@nestjs/passport");
const axios_1 = require("@nestjs/axios");
const axios_2 = require("axios");
const rxjs_1 = require("rxjs");
let UsersController = class UsersController {
    constructor(usersService, responseProvider, authService, httpService) {
        this.usersService = usersService;
        this.responseProvider = responseProvider;
        this.authService = authService;
        this.httpService = httpService;
    }
    async facebookLogin() {
        return common_1.HttpStatus.OK;
    }
    async facebookLoginRedirect(req) {
        let user = {};
        if (req.hasOwnProperty('user')) {
            let requestUser = req.user.user;
            let email = requestUser.email;
            let access_token = req.user.accessToken;
            const existingUser = await this.usersService.findOne({ email: email });
            let CreateUserDto = {};
            CreateUserDto.firstName = requestUser.firstName || '';
            CreateUserDto.lastName = requestUser.lastName || '';
            CreateUserDto.email = email || '';
            CreateUserDto.token = access_token;
            CreateUserDto.isLoginWithFacebook = true;
            if (existingUser) {
                user = await this.usersService.update(existingUser, CreateUserDto);
            }
            else {
                user = await this.usersService.create(CreateUserDto);
            }
        }
        return {
            statusCode: common_1.HttpStatus.OK,
            data: user,
        };
    }
    async logout(id) {
        const existingUser = await this.usersService.findOne({ 'id': id });
        await this.usersService.update(existingUser, { token: null });
        return this.responseProvider.success('User logged out successfully.', true);
    }
    async create(CreateUserDto) {
        CreateUserDto.firstName = CreateUserDto.firstName.toLocaleLowerCase();
        CreateUserDto.lastName = CreateUserDto.lastName.toLocaleLowerCase();
        CreateUserDto.email = CreateUserDto.email.toLocaleLowerCase();
        CreateUserDto.password = await (0, data_helpers_1.hashPassword)(CreateUserDto.password);
        const existingUser = await this.usersService.findOne({ email: CreateUserDto.email });
        if (existingUser) {
            throw new common_1.BadRequestException('User Already exists.');
        }
        let user = await this.usersService.create(CreateUserDto);
        let authenticatedData = await this.authService.login(user);
        await this.usersService.update(user, { token: authenticatedData.access_token });
        return this.responseProvider.success('User created successfully.', user);
    }
    async findAll(perPage, page) {
        const pagination = {
            page: page || 1,
            perPage: perPage || 10,
        };
        const users = await this.usersService.findAll(pagination);
        const totalRecords = await this.usersService.countAll();
        const numberOfPages = Math.ceil(totalRecords / pagination.perPage);
        return this.responseProvider.success('ok', {
            users,
            totalRecords,
            numberOfPages,
        });
    }
    async homePage(id) {
        let user = await this.usersService.findOne({ 'id': id });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        if (user.isLoginWithFacebook) {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService
                .get('https://graph.facebook.com/me?access_token=' + user.token)
                .pipe((0, rxjs_1.catchError)((error) => {
                if (axios_2.default.isAxiosError(error) && error.response) {
                    const apiError = error;
                    const { status, data: { message }, } = apiError.response;
                    throw new common_1.HttpException({ message }, status);
                }
                const { message } = error;
                throw new common_1.HttpException({ message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })));
            return this.responseProvider.success('ok', data);
        }
        return this.responseProvider.success('ok', user);
    }
    async findOne(id) {
        const user = await this.usersService.findOne({ 'id': id });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        return this.responseProvider.success('ok', user);
    }
    async update(id, UpdateUserDto) {
        const existingUser = await this.usersService.findOne({ 'id': id });
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found.');
        }
        const updatedUser = await this.usersService.update(existingUser, UpdateUserDto);
        return this.responseProvider.success('User updated successfully.', updatedUser);
    }
    async remove(id) {
        const existingUser = await this.usersService.findOne({ 'id': id });
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found.');
        }
        this.usersService.remove(existingUser);
        return this.responseProvider.success('User deleted successfully.', {});
    }
    async login(LoginDto) {
        LoginDto.email = LoginDto.email.toLocaleLowerCase();
        LoginDto.password = LoginDto.password;
        const user = await this.authService.validateUser(LoginDto.email, LoginDto.password);
        if (user) {
            let authenticatedData = await this.authService.login(user);
            const existingUser = await this.usersService.findOne({ 'id': user.id });
            await this.usersService.update(existingUser, { token: authenticatedData.access_token });
            return this.responseProvider.success('User logged in successfully.', authenticatedData);
        }
        else {
            return this.responseProvider.success('Unauthenticated user.', false);
        }
    }
};
__decorate([
    (0, common_1.Get)("/facebookLogin"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("facebook")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "facebookLogin", null);
__decorate([
    (0, common_1.Get)("/facebookLogin/redirect"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("facebook")),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "facebookLoginRedirect", null);
__decorate([
    (0, common_1.Put)('/logout'),
    __param(0, (0, common_1.Body)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('perPage', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('/homePage'),
    __param(0, (0, common_1.Body)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "homePage", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        ResponseProvider_1.ResponseProvider,
        auth_service_1.AuthService,
        axios_1.HttpService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map