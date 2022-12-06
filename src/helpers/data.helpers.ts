import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);    
}

export async function comparePassword(originalPassword: string, hashPassword: string) {
    
    await bcrypt.compare(originalPassword, hashPassword, function(err, result) {
        return result;
    });
}