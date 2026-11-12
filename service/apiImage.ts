import type { ImageResponse } from "@/types";
import type { Params } from "@/types/api/indext";
import ky from "ky";

const API_URL = `https://pixabay.com/api/?key=${process.env.EXPO_PUBLIC_API_KEY}`;
export const PAGE_SIZE = 20;

export const getImages = async (params: Params) => {
  try {
    const searchParams = new URLSearchParams({ per_page: String(PAGE_SIZE) });
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, String(value));
    });
    const url = `${API_URL}&${searchParams.toString()}`;

    console.log(url);

    const res = await ky.get<ImageResponse>(url).json();
    return { hits: res.hits, totalHits: res.totalHits };
  } catch {
    return { hits: [], totalHits: 0 };
  }
};
