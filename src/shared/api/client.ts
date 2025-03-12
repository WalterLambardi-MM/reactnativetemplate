import axios from 'axios';
import { ApiError } from './error-handling';

export const createApiClient = (baseURL: string) => {
  const axiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const get = async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await axiosInstance.get<T>(endpoint);
      return response.data;
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
