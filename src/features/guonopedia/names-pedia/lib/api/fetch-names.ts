import type { NameItem } from "../../types";

export const fetchNames = async ({
  token,
  page = "1",
  search,
  limit = "20",
  type,
  gender,
  status,
  signal,
}: {
  token: string;
  page?: string;
  limit?: string;
  search?: string;
  type?: string;
  gender?: "neutral" | "male" | "female";
  status?: string;
  signal?: AbortSignal;
}): Promise<{ msg: string; data: NameItem[]; pagination: { page: number; totalPages: number } }> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/names?search=${encodeURIComponent(search ?? "")}&page=${page ?? 1}&limit=${limit}${type ? `&nameType=${type}` : ""}${gender ? `&gender=${gender}` : ""}${status ? `&status=${status}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch names");
    }

    const { msg = "Success", data } = await response.json();

    const items = Array.isArray(data) ? data : (data?.items ?? []);

    return {
      msg,
      data: items,
      pagination: { page: data?.page ?? 1, totalPages: data?.totalPages ?? 1 },
    };
  } catch (error) {
    const err = error as Error;
    return {
      msg: err.message,
      data: [],
      pagination: { page: 1, totalPages: 1 },
    };
  }
};
