import { HttpAdapter } from "../interfaces/http-adapter.interface";
import axios, { AxiosInstance } from 'axios';
import { Injectable } from "@nestjs/common";

@Injectable()
export class AxiosAdapter implements HttpAdapter {
    private readonly axiosInstance: AxiosInstance = axios;
    async get<T>(url: string): Promise<T> {
        try {            
            const { data } = await this.axiosInstance.get<T>(url);
            return data;
        } catch (error) {
            throw new Error(`Error while queryin the endpoint ${url}`);
        }
    }

}