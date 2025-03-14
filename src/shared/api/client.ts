import axios from 'axios';
import { ApiError } from './error-handling';
import { API_TIMEOUT } from '../constants/api';
import { ApiResponse } from '../types/api.types';

export const createApiClient = (baseURL: string) => {
  const axiosInstance = axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const get = async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await axiosInstance.get<ApiResponse<T> | T>(endpoint);

      // Si la respuesta tiene el formato ApiResponse, devuelve data
      if (
        response.data &&
        response.data &&
        typeof response.data === 'object' &&
        'data' in response.data &&
        'status' in response.data
      ) {
        return (response.data as ApiResponse<T>).data;
      }

      // Si no, devuelve la respuesta directamente
      return response.data as T;
    } catch (error) {
      console.error('API Error:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.status || 0,
          error.message,
          error.response?.data,
        );
      }
      throw new ApiError(0, (error as Error).message || 'Unknown error');
    }
  };

  //Post
  //Delete
  //Put

  return { get };
};
