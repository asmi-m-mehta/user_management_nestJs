export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(originalPassword: string, hashPassword: string): Promise<void>;
