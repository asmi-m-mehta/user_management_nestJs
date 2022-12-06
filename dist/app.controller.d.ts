import { ResponseProvider } from './providers/ResponseProvider';
export declare class AppController {
    private readonly responseProvider;
    constructor(responseProvider: ResponseProvider);
    getHello(): {
        message: string;
        payload: any;
    };
}
