export function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

// Returns HTTP status code for Axios errors, otherwise falls back to the message.
export function toHttpStatus(err: unknown): string {
  if (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof (err as { response?: { status?: unknown } }).response?.status ===
      'number'
  ) {
    return String((err as { response: { status: number } }).response.status);
  }
  return toErrorMessage(err);
}
