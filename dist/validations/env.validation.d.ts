declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test"
}
declare class EnvironmentVariables {
    NODE_ENV: Environment;
    APP_PORT: number;
    DB_HOST: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    DB_PORT: number;
    ALLOW_ORIGIN_ENV: string;
    AUTH_URL: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
export {};
