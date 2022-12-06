"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotEnv = require("dotenv");
dotEnv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('APP_PORT');
    await app.listen(port);
    console.log(`🚀 on port : ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map