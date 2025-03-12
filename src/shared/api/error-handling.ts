export class ApiError extends Error {
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
