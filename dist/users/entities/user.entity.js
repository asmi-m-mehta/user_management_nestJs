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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const class_transformer_1 = require("class-transformer");
const sequelize_typescript_1 = require("sequelize-typescript");
let UserModel = class UserModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        autoIncrement: true,
        type: sequelize_typescript_1.DataType.BIGINT,
    }),
    __metadata("design:type", Number)
], UserModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: 'firstName',
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], UserModel.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: 'lastName',
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], UserModel.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ unique: true, }),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: 'password',
        type: sequelize_typescript_1.DataType.STRING,
    }),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: 'isLoginWithFacebook',
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], UserModel.prototype, "isLoginWithFacebook", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: 'isActive',
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: true
    }),
    __metadata("design:type", Boolean)
], UserModel.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: 'token',
        type: sequelize_typescript_1.DataType.TEXT
    }),
    __metadata("design:type", String)
], UserModel.prototype, "token", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_at', type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], UserModel.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_at', type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], UserModel.prototype, "updatedAt", void 0);
UserModel = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'users',
        timestamps: true,
    })
], UserModel);
exports.UserModel = UserModel;
//# sourceMappingURL=user.entity.js.map