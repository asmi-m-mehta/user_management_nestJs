"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const user_entity_1 = require("./entities/user.entity");
const users_controller_1 = require("./users.controller");
const sequelize_1 = require("@nestjs/sequelize");
const ResponseProvider_1 = require("../providers/ResponseProvider");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const auth_service_1 = require("../auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const facebook_strategy_1 = require("../auth/facebook.strategy");
const axios_1 = require("@nestjs/axios");
let UsersModule = class UsersModule {
    configure(consumer) {
        consumer
            .apply(AuthMiddleware_1.AuthMiddleware)
            .exclude({ path: 'users/:id', method: common_1.RequestMethod.GET }, { path: 'users/:id', method: common_1.RequestMethod.DELETE }, { path: 'users', method: common_1.RequestMethod.POST }, { path: 'users', method: common_1.RequestMethod.GET }, { path: 'users/login', method: common_1.RequestMethod.POST }, { path: 'users/facebookLogin', method: common_1.RequestMethod.GET }, { path: 'users/facebookLogin/redirect', method: common_1.RequestMethod.GET })
            .forRoutes(users_controller_1.UsersController);
    }
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([user_entity_1.UserModel]), axios_1.HttpModule],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, ResponseProvider_1.ResponseProvider, auth_service_1.AuthService, jwt_1.JwtService, facebook_strategy_1.FacebookStrategy],
        exports: [users_service_1.UsersService],
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map