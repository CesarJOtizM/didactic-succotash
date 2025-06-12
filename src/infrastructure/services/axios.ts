import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

let axiosInstance: AxiosInstance;

const createAxios = (baseURL: string) => {
	axiosInstance = axios.create({ baseURL });
};

const setupInterceptors = () => {
	axiosInstance.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
			config.headers.set('x-api-key', process.env.NEXT_PUBLIC_EXA_API_KEY);
			return config;
		},
		error => {
			return Promise.reject(error);
		}
	);

	axiosInstance.interceptors.response.use(
		(response: AxiosResponse) => {
			console.log(`Response from: ${response.config.url}`, {
				data: response.data,
				status: response.status
			});
			return response;
		},
		error => {
			if (error.response) {
				console.error(`Error response from: ${error.response.config.url}`);
			}
			{
				console.error(`Error: ${error.message}`);
			}
			return Promise.reject(error);
		}
	);
};

export const initAxios = (apiUrl: string) => {
	createAxios(apiUrl);
	setupInterceptors();
	return axiosInstance;
};

// Initialize with default base URL for testing
export const api = initAxios(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
