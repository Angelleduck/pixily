import type { ImageResponse, ImageType } from "@/types";
import ky from "ky";

const API_URL = `https://pixabay.com/api/?key=${process.env.EXPO_PUBLIC_API_KEY}`;

export const getImages = async (params: Record<string, any>) => {
  try {
    let url = API_URL;

    Object.keys(params).forEach((key) => {
      const value = key === "q" ? encodeURI(params[key]) : params[key];
      url += `&${key}=${value}`;
    });

    const res = await ky.get<ImageResponse>(url).json();
    return res.hits as ImageType[];
  } catch {
    return [];
  }
};
