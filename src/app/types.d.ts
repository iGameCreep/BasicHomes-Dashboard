export interface LoginResponse {
    success: boolean;
    sessionId: string;
}

export interface SessionInformationsResponse {
    available: boolean;
    accountId: number;
}

export interface SessionDestroy {
    success: boolean;
}

export interface UserInformations {
    accountId: number;
    userId: string;
    servers: UserServer[];
    username?: string;
}

export interface UserServer {
    server_id: string;
    server_name: string;
    rank: 'admin' | 'user';
}

export interface AccountInfoAvailable {
    available: boolean;
    userInfos?: UserInformations;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_USER: string;
            DATABASE_PASSWORD: string;
            DATABASE_NAME: string;
            DATABASE_HOST: string;
            DATABASE_PORT: string;

            API_DOMAIN: string;
            API_PORT: string;

            WEBSITE_DOMAIN: string;
            WEBSITE_PORT: string;
        }
    }
}