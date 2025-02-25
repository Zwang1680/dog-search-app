import axios, { AxiosResponse } from "axios";

const BASE_URL = 'https://frontend-take-home-service.fetch.com';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

export const login = async (name: string, email: string): Promise<AxiosResponse> => {
    return api.post('/auth/login', { name, email });
}

export const logout = async (): Promise<AxiosResponse> => {
    return api.post('/auth/logout');
}