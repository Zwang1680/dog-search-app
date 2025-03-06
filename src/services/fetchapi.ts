import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const BASE_URL = 'https://frontend-take-home-service.fetch.com';

export interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}
  
export interface Location {
    zip_code: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    county: string;
}
  
export interface Coordinates {
    lat: number;
    lon: number;
}

class FetchAPI {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
          baseURL: BASE_URL,
          withCredentials: true,
        });
    }

    private handleResponse<T>(response: AxiosResponse<T>): T {
        return response.data;
    }

    private handleError(error: AxiosError): never {
        if (error.response) {
          if (typeof error.response.data === 'object' && error.response.data !== null && 'message' in error.response.data) {
            throw new Error(error.response.data.message as string); // Type assertion for safety
          } else {
            throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
          }
        }
        throw new Error('Network Error');
    }
    
    async login(name: string, email: string): Promise<void> {
        return this.api.post('/auth/login', { name, email }).then(this.handleResponse).catch(this.handleError);
    }
    
    async logout(): Promise<void> {
        return this.api.post('/auth/logout').then(this.handleResponse).catch(this.handleError);
    }
    
    async getBreeds(): Promise<string[]> {
        return this.api.get<string[]>('/dogs/breeds').then(this.handleResponse).catch(this.handleError);
    }

    async searchDogs(params: any): Promise<{ resultIds: string[]; total: number; next?: string; prev?: string }> {
        return this.api.get<{ resultIds: string[]; total: number; next?: string; prev?: string }>('/dogs/search', { params }).then(this.handleResponse).catch(this.handleError);
    }

    async getDogsByIds(dogIds: string[]): Promise<Dog[]> {
        return this.api.post<Dog[]>('/dogs', dogIds).then(this.handleResponse).catch(this.handleError);
    }
}

export const fetchAPI = new FetchAPI();