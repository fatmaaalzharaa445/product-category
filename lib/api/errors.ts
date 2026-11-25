export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.name === "AbortError") return "The request was cancelled.";
  if (error instanceof TypeError) return "Network error — check your connection and try again.";
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}
