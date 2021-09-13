import httpClient from 'Services/HttpClient';
import StorageService from 'Services/Storage';
import { UserResponseData } from 'Interfaces/Auth';
import axios, { AxiosRequestConfig } from 'axios';

class ApiService {
  protected request = {
    post: (token?: string) => async <TResponse, TData = {}>(
      uri: string,
      data?: TData,
      config?: AxiosRequestConfig,
    ): Promise<TResponse> => {
      try {
        const request = await httpClient(token);
        const response = await request.post(uri, data, config);

        return response.data;
      } catch (error) {
        return this.handleRequestError<TResponse>(token, uri, error);
      }
    },
    put: (token?: string) => async <TResponse, TData = {}>(
      uri: string,
      data: TData,
      config?: AxiosRequestConfig,
    ): Promise<TResponse> => {
      try {
        const request = await httpClient(token);
        const response = await request.put(uri, data, config);

        return response.data;
      } catch (error) {
        return this.handleRequestError<TResponse>(token, uri, error);
      }
    },
    patch: (token?: string) => async <TResponse, TData = {}>(
      uri: string,
      data?: TData,
      config?: AxiosRequestConfig,
    ): Promise<TResponse> => {
      try {
        const request = await httpClient(token);
        const response = await request.patch(uri, data, config);

        return response.data;
      } catch (error) {
        return this.handleRequestError<TResponse>(token, uri, error);
      }
    },
    get: (token?: string) => async <TResponse>(
      uri: string,
      config?: AxiosRequestConfig,
    ): Promise<TResponse> => {
      try {
        const request = await httpClient(token);
        const response = await request.get(uri, config);

        return response.data;
      } catch (error) {
        return this.handleRequestError<TResponse>(token, uri, error);
      }
    },
    delete: (token?: string) => async <TResponse>(
      uri: string,
      config?: AxiosRequestConfig,
    ): Promise<TResponse> => {
      try {
        const request = await httpClient(token);
        const response = await request.delete(uri, config);

        return response.data;
      } catch (error) {
        return this.handleRequestError<TResponse>(token, uri, error);
      }
    },
  };

  protected handleRequestError = <TResponse>(token, uri, error) => {
    if (axios.isCancel(error)) {
      return {} as TResponse;
    }

    if (error.response && error.response.data) {
      return this.handleExpiredToken(
        error.response.data,
        this.request.delete,
        token,
        uri,
      );
    }

    throw error;
  };

  protected handleExpiredToken = async (errorData, action, token, ...args) => {
    if (errorData.statusCode === 403 && errorData.message === 'Token expired!') {
      return this.refreshToken(action, token, ...args);
    }

    throw typeof errorData === 'string' ? new Error(errorData) : errorData;
  };

  protected refreshToken = async (action, token, ...args) => {
    const tokenResponse = await this.request.get(token)<UserResponseData>(
      'auth/refresh-token',
    );

    if (!token) {
      await StorageService.setAccessToken(tokenResponse.accessToken);
    }

    return action(token ? tokenResponse.accessToken : null)(...args);
  };

  static async downloadFile(url: string, config?: AxiosRequestConfig) {
    return axios.request({ ...config, url });
  }
}

export default ApiService;
