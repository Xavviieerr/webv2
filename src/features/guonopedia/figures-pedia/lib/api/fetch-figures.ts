export const fetchFigures = async ({
  token,
  page = "1",
  limit = "10",
  search,
  category,
  status,
  signal,
}: {
  token: string;
  page?: string;
  limit?: string;
  search: string;
  category?: string;
  status?: string;
  signal?: AbortSignal;
}) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/figures?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}&sortBy=fullName&sortDir=ASC${status ? `&status=${status}` : ""}${category ? `&occupation=${category}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message ?? "Failed to fetch figures");
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
