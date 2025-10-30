import { FlashList } from "@shopify/flash-list";
import { ImageCard } from "./image-card";

interface GalleryProps {
  images: Record<string, any>[];
}

export default function Gallery({ images }: GalleryProps) {
  return (
    <FlashList
      masonry
      numColumns={2}
      data={images}
      optimizeItemArrangement={false}
      renderItem={({ item, index }) => <ImageCard item={item} index={index} />}
    />
  );
}
