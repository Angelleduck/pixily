import { theme } from "@/constants/theme";
import { getImageSize, wp } from "@/helper/common";
import type { ImageType } from "@/types";
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";

interface ImageProps {
  item: ImageType;
  index: number;
  onSelectImage: (image: ImageType) => void;
}

export function ImageCard({ item, index, onSelectImage }: ImageProps) {
  const sizeStyle = () => {
    const height = item.webformatHeight;
    const width = item.webformatWidth;
    return { height: getImageSize(height, width) };
  };

  const isRightColumn = (index + 1) % 2 === 0;
  const columnMargin = !isRightColumn
    ? { marginRight: wp(1) }
    : { marginLeft: wp(1) };

  return (
    <Pressable
      onPress={() => {
        onSelectImage(item);
      }}
      style={[styles.card, sizeStyle(), columnMargin]}
    >
      <Image
        transition={150}
        style={[sizeStyle()]}
        source={item.webformatURL}
        contentFit="cover"
        accessible
        accessibilityLabel={`pixily-image-${index + 1}`}
      />

      {/* react-native Image component */}
      {/* <Image
        // transition={150}
        style={[sizeStyle()]}
        source={{ uri: item.webformatURL }}
        // contentFit="cover"
        accessible
        accessibilityLabel={`pixily-image-${index + 1}`}
      /> */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.Colors.neutral(0.3),
    marginBottom: 10,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
});
