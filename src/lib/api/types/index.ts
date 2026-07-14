export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
