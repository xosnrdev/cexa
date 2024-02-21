import { Response } from "express";

interface ErrorResponse {
  code: number;
  message: string;
}

interface SuccessResponse<T> {
  success: boolean;
  payload: T | null;
  error: null;
}

interface FailureResponse {
  success: boolean;
  payload: null;
  error: ErrorResponse;
}

type ApiResponse<T> = SuccessResponse<T> | FailureResponse;

function sendResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null
): Response<ApiResponse<T>> {
  const success = statusCode >= 200 && statusCode < 300;
  const response: ApiResponse<T> = success
    ? { success: true, payload: data, error: null }
    : { success: false, payload: null, error: { code: statusCode, message } };

  res.status(statusCode).json(response);

  return res;
}

export default sendResponse;
