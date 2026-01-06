type JsonResponse = { body: string };

export function parseJsonBody<T>(response: JsonResponse): T {
  return JSON.parse(response.body) as T;
}
