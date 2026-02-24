import { theme } from "@/constants/theme";
import { getImageSize, wp } from "@/helper/common";
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";

interface ImageProps {
  item: Record<string, any>;
  index: number;
}

export function ImageCard({ item, index }: ImageProps) {
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
        console.log(item.pageURL);
      }}
      style={[styles.card, sizeStyle(), columnMargin]}
    >
      <Image
        // transition={150}
        style={[sizeStyle()]}
        source={item.webformatURL}
        contentFit="cover"
        accessible
        accessibilityLabel={`pixily-image-${index + 1}`}
      />
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
