interface ImageResponse {
  total: number;
  totalHits: number;
  hits: Record<string, any>[];
}

export type { ImageResponse };
