import { ApiError as IApiError } from '../types/api.types';

export class ApiError extends Error implements IApiError {
  constructor(
    public statusCode: number,
    message: string,
    public data?: any,
  ) {
    super(message);
  }

  static fromResponse(response: Response, data?: any): ApiError {
    return new ApiError(
      response.status,
      data?.message || response.statusText,
      data,
    );
  }
}
