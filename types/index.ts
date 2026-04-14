interface ImageResponse {
  total: number;
  totalHits: number;
  hits: ImageType[];
}

interface Filters {
  order?: string;
  orientation?: string;
  image_type?: string;
  colors?: string;
}

interface ImageType {
  id: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  webformatWidth: number;
  webformatHeight: number;
  webformatURL: string;
  pageURL: string;
}

export type { Filters, ImageResponse, ImageType };
