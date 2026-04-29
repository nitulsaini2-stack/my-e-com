// API client — kept for interface compatibility.
// External HTTP calls (e.g. fakestoreapi.com) are BLOCKED on the Internet Computer
// platform. All data comes from local mock data in mockData.ts via products.ts / categories.ts.

export async function apiGet<T>(_path: string): Promise<T> {
  throw new Error(
    "apiGet() is disabled — external API calls are blocked on this platform. Use mock data functions instead.",
  );
}

export async function apiPost<T>(_path: string, _body: unknown): Promise<T> {
  throw new Error(
    "apiPost() is disabled — external API calls are blocked on this platform. Use mock data functions instead.",
  );
}
