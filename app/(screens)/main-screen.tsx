import { Categories } from "@/components/categories";
import Gallery from "@/components/gallery";
import Loader from "@/components/Loader";
import Modal from "@/components/modal";
import { theme } from "@/constants/theme";
import { hp } from "@/helper/common";
import { debounce } from "@/helper/utils";
import { getImages } from "@/service/apiImage";
import { FontAwesome6 } from "@expo/vector-icons";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

let page = 1;
export default function Page() {
  const [images, setImages] = useState<Record<string, any>[]>([]);
  const [category, setCategory] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHide, setIsHide] = useState<boolean>(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const lastScrollY = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);

    async function fetchData() {
      const data = await getImages({});
      setImages(data);
    }
    fetchData();
  }, []);

  async function fetchData(params: Record<string, any>, append = false) {
    const data = await getImages(params);

    if (append) {
      setImages((prevImages) => [...prevImages, ...data]);
    } else {
      setImages(data);
    }
  }
  function handleSearch(value: string) {
    setSearchText(value);
    fetchData({ q: value });
  }
  const handleCategory = (value: string) => {
    if (category === value) {
      setCategory("");
      fetchData({});
    } else {
      setCategory(value);
      fetchData({ category: value });
    }
    page = 1;
  };

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
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentHeight = e.nativeEvent.contentSize.height;
    const scrollOffest = e.nativeEvent.contentOffset.y;
    const scrollViewHeight = e.nativeEvent.layoutMeasurement.height;

    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffest >= bottomPosition - 1) {
      page += 1;
      const params: Record<string, any> = { page };

      if (category) params.category = category;
      if (searchText) params.q = searchText;

      fetchData(params, true);
    }

    if (scrollOffest > lastScrollY.current && scrollOffest > 30) {
      setIsHide(true);
    } else {
      setIsHide(false);
    }

    lastScrollY.current = scrollOffest;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[{ zIndex: 10 }, isHide ? { opacity: 0 } : { opacity: 1 }]}>
        <Pressable
          style={[
            styles.headerContainter,
            {
              position: "absolute",
              top: 0,
              width: "100%",
              backgroundColor: "#f0f0f0",
            },
          ]}
        >
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
      <ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={[styles.inputContainer, { marginTop: 53.5 }]}>
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

        {isLoading ? <Loader /> : <Gallery images={images} />}
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
