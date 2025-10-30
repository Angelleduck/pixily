import { ImageResponse } from "@/types";
import ky from "ky";

export const getImages = async () => {
  const res = await ky
    .get<ImageResponse>(
      `https://pixabay.com/api/?key=${process.env.EXPO_PUBLIC_API_KEY}`
    )
    .json();
  return res.hits;
};
