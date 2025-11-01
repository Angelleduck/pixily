import Categories from "@/components/categories";
import Gallery from "@/components/gallery";
import Modal from "@/components/modal";
import { theme } from "@/constants/theme";
import { hp } from "@/helper/common";
import { debounce } from "@/helper/utils";
import { getImages } from "@/service/apiImage";
import { FontAwesome6 } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const [images, setImages] = useState<Record<string, any>[]>([]);
  const [category, setCategory] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, any>>({});

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const handleFilterApply = () => {
    const params = { ...filters };

    if (category) params.category = category;
    if (searchText) params.q = searchText;

    fetchData(params);
    handleCloseModalPress();
  };
  const handleFilterReset = () => {
    setFilters({});
    fetchData({});
    handleCloseModalPress();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainter}>
          <Text style={styles.titleText}>Pixily</Text>
          <Pressable onPress={handlePresentModalPress}>
            <FontAwesome6
              name="bars-staggered"
              size={24}
              color={theme.Colors.neutral(0.7)}
            />
          </Pressable>
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
      <Modal
        filters={filters}
        handleFilterApply={handleFilterApply}
        handleFilterReset={handleFilterReset}
        setFilters={setFilters}
        bottomSheetModalRef={bottomSheetModalRef}
      />
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
