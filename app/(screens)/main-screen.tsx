import Categories from "@/components/categories";
import Gallery from "@/components/gallery";
import { theme } from "@/constants/theme";
import { hp } from "@/helper/common";
import { debounce } from "@/helper/utils";
import { getImages } from "@/service/apiImage";
import { FontAwesome6 } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const [images, setImages] = useState<Record<string, any>[]>([]);
  const [category, setCategory] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  useEffect(() => {
    async function fetchData() {
      const data = await getImages({});
      setImages(data);
    }
    fetchData();
  }, []);

  async function fetchData(params: Record<string, any>) {
    const data = await getImages(params);
    setImages(data);
  }
  function handleSearch(value: string) {
    setSearchText(value);
    fetchData({ q: value });
  }
  function handleCategory(value: string) {
    if (category === value) {
      setCategory("");
      fetchData({});
    } else {
      setCategory(value);
      fetchData({ category: value });
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleSearch = useCallback(debounce(handleSearch, 600), []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainter}>
          <Text style={styles.titleText}>Pixily</Text>
          <FontAwesome6
            name="bars-staggered"
            size={24}
            color={theme.Colors.neutral(0.7)}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome6
            name="magnifying-glass"
            size={20}
            color={theme.Colors.neutral(0.3)}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => {
              debouncedHandleSearch(text);
            }}
            placeholder="search for photos..."
          />
        </View>
        <View>
          <Categories category={category} handleCategory={handleCategory} />
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
    color: theme.Colors.neutral(0.9),
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
    borderColor: theme.Colors.neutral(0.2),
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
});
