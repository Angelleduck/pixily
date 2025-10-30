import { theme } from "@/constants/theme";
import { getImageSize, wp } from "@/helper/common";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

interface ImageProps {
  item: Record<string, any>;
  index: number;
}

export function ImageCard({ item, index }: ImageProps) {
  const getHeight = () => {
    const { webformatHeight: height, webformatWidth: width } = item;
    return {
      height: getImageSize(height, width),
    };
  };

  const isLastRow = (index + 1) % 2 === 0;
  return (
    <View
      style={[
        styles.card,
        getHeight(),
        !isLastRow ? { marginRight: wp(1) } : { marginLeft: wp(1) },
      ]}
    >
      <Image style={[getHeight()]} source={item.webformatURL} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "red",
    marginBottom: 10,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
});
