import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

import { config } from '@/config';

/**
 * Base API service class that handles HTTP requests and responses using Result pattern
 */
export class BaseApiService {
  protected axiosInstance: AxiosInstance;
  private static authToken: string | null = null;

  constructor(serviceConfig?: {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
  }) {
    this.axiosInstance = axios.create({
      baseURL: serviceConfig?.baseURL ?? config().API_BASE_URL,
      timeout: serviceConfig?.timeout ?? config().API_TIMEOUT,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        ...(serviceConfig?.headers ?? {}),
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (BaseApiService.authToken && config.headers) {
          config.headers.Authorization = `Bearer ${BaseApiService.authToken}`;
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error.response?.data);
      },
    );

    // Response interceptor - handle token expiration
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          BaseApiService.authToken = null;
        }

        return Promise.reject(error.response?.data);
      },
    );
  }

  /**
   * Generic GET request
   */
  public async get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse = await this.axiosInstance.get(endpoint, {
      params,
      ...config,
    });

    return response.data;
  }

  /**
   * Generic POST request
   */
  public async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse = await this.axiosInstance.post(
      endpoint,
      data,
      config,
    );

    return response.data;
  }

  /**
   * Generic PUT request
   */
  public async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse = await this.axiosInstance.put(
      endpoint,
      data,
      config,
    );

    return response.data;
  }

  /**
   * Generic DELETE request
   */
  public async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse = await this.axiosInstance.delete(
      endpoint,
      config,
    );

    return response.data;
  }

  /**
   * Set authentication token in memory (shared across all instances)
   */
  public setAuthToken(token: string): void {
    BaseApiService.authToken = token;
  }

  /**
   * Clear authentication token from memory (affects all instances)
   */
  public clearAuthToken(): void {
    BaseApiService.authToken = null;
  }
}

export default BaseApiService;
