import Gallery from "@/components/gallery";
import { categories } from "@/constants/data";
import { theme } from "@/constants/theme";
import { hp } from "@/helper/common";
import { getImages } from "@/service/apiImage";
import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const [images, setImages] = useState<Record<string, any>[]>([]);
  useEffect(() => {
    async function fetchData() {
      const data = await getImages();
      setImages(data);
    }
    fetchData();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainter}>
          <Text style={styles.titleText}>Pixily</Text>
          <FontAwesome6
            name="bars-staggered"
            size={24}
            color={theme.Colors.gray(0.7)}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome6
            name="magnifying-glass"
            size={20}
            color={theme.Colors.gray(0.3)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="search for photos..."
          />
        </View>
        <View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filter} // important
          >
            {categories.map((el) => (
              <View key={el} style={styles.categoryBox}>
                <Text style={styles.categoryText}>{el}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <Gallery images={images} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeight.medium,
    color: theme.Colors.gray(0.9),
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
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.Colors.gray(0.2),
    borderRadius: theme.radius.sm,
    paddingHorizontal: 15,
    paddingVertical: 2,
    backgroundColor: "white",
    marginBottom: 13,
  },
  textInput: {
    fontSize: hp(1.8),
    flex: 1,
  },
  filter: {
    gap: 5,
    marginBottom: 15,
  },
  categoryBox: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.Colors.gray(0.2),
    borderRadius: theme.radius.sm,
    backgroundColor: "white",
  },
  categoryText: {
    fontWeight: theme.fontWeight.medium,
    color: theme.Colors.gray(0.8),
  },
});
