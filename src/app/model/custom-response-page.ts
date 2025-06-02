import { Page } from "./page";


export interface CustomPageResponse <T>{
    timeStamp: string;
    statusCode: number;
    status: string;
    message: string;
    data: {
        page: T
    };
}