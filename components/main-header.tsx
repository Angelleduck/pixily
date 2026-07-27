import { theme } from "@/constants/theme";
import { hp } from "@/helper/common";
import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface MainHeaderProps {
  isHide: boolean;
  scrollToTop: () => void;
  handlePresentModalPress: () => void;
}

export function MainHeader({
  isHide,
  scrollToTop,
  handlePresentModalPress,
}: MainHeaderProps) {
  return (
    <View style={[{ zIndex: 5 }, isHide ? { opacity: 0 } : { opacity: 1 }]}>
      <Pressable style={styles.headerContainter}>
        <Text onPress={scrollToTop} style={styles.titleText}>
          Pixily
        </Text>
        <Pressable onPress={handlePresentModalPress}>
          <FontAwesome6
            name="bars-staggered"
            size={24}
            color={theme.Colors.neutral(0.7)}
          />
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "#fff",
  },
  titleText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeight.medium,
    color: theme.Colors.neutral(0.9),
  },
});
