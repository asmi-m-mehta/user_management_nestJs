"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt = require("bcrypt");
async function hashPassword(password) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
}
exports.hashPassword = hashPassword;
async function comparePassword(originalPassword, hashPassword) {
    await bcrypt.compare(originalPassword, hashPassword, function (err, result) {
        return result;
    });
}
exports.comparePassword = comparePassword;
//# sourceMappingURL=data.helpers.js.map