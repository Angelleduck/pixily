import { theme } from "@/constants/theme";
import { hp } from "@/helper/common";
import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainter}>
        <Text style={styles.titleText}>Pixily</Text>
        <FontAwesome6 name="bars-staggered" size={24} color="black" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeight.medium,
  },
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  headerContainter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
