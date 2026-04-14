import type { ImageResponse, ImageType } from "@/types";
import ky from "ky";

const API_URL = `https://pixabay.com/api/?key=${process.env.EXPO_PUBLIC_API_KEY}`;

export const getImages = async (params: Record<string, any>) => {
  let url = API_URL;

  Object.keys(params).forEach((key) => {
    const value = key === "q" ? encodeURI(params[key]) : params[key];
    url += `&${key}=${value}`;
  });

  const res = await ky.get<ImageResponse>(url).json();
  return res.hits as ImageType[];
};

// const API_URL = `https://pixabay.com/api/?key=${process.env.EXPO_PUBLIC_API_KEY}`;

// export const getImages = async (params: Record<string, any>) => {
//   let url = API_URL;

//   Object.keys(params).forEach((key) => {
//     const value = key === "q" ? encodeURIComponent(params[key]) : params[key];

//     url += `&${key}=${value}`;
//   });

//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

//   try {
//     const response = await fetch(url, {
//       method: "GET",
//       signal: controller.signal,
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error: ${response.status}`);
//     }

//     const data: ImageResponse = await response.json();
//     return data.hits as ImageType[];
//   } catch (error: any) {
//     if (error.name === "AbortError") {
//       console.log("Request timed out");
//     } else {
//       console.log("Fetch error:", error.message);
//     }
//     throw error;
//   } finally {
//     clearTimeout(timeout);
//   }
// };
