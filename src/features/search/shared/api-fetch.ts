type FetchOptions = {
  token: string;
  signal?: AbortSignal;
};

type ApiResponse<T> = {
  msg: string;
  data: T;
};

export async function apiFetch<T>(
  url: string,
  { token, signal }: FetchOptions,
): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? body.msg ?? `Request failed (${response.status})`);
  }

  const json: ApiResponse<T> = await response.json();
  return json.data;
}
