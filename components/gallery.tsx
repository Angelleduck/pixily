import { theme } from "@/constants/theme";
import { hp } from "@/helper/common";
import type { ImageType } from "@/types";
import { FontAwesome6 } from "@expo/vector-icons";
import { FlashList, type FlashListRef } from "@shopify/flash-list";
import type { RefObject } from "react";
import {
  ActivityIndicator,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Categories } from "./categories";
import { ImageCard } from "./image-card";

interface GalleryProps {
  flashListRef: RefObject<FlashListRef<ImageType> | null>;
  debouncedHandleSearch: (text: string) => void;
  images: ImageType[];
  handleLoadMore: () => Promise<void>;
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  refreshing: boolean;
  handleRefreshing: () => void;
  loadingMore: boolean;
  handleSelectedImage: (image: ImageType) => void;
  category: string;
  handleCategory: (category: string) => void;
}

export function Gallery(props: GalleryProps) {
  const {
    flashListRef,
    debouncedHandleSearch,
    images,
    handleLoadMore,
    onScroll,
    refreshing,
    handleRefreshing,
    loadingMore,
    handleSelectedImage,
    category,
    handleCategory,
  } = props;
  return (
    <FlashList
      ref={flashListRef}
      masonry
      numColumns={2}
      data={images}
      optimizeItemArrangement={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.2}
      onScroll={onScroll}
      refreshing={refreshing}
      onRefresh={handleRefreshing}
      progressViewOffset={35}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
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
              placeholderTextColor={"black"}
            />
          </View>
          <View>
            <Categories category={category} handleCategory={handleCategory} />
          </View>
        </>
      }
      ListFooterComponent={
        loadingMore ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="large" color={theme.Colors.Black} />
          </View>
        ) : null
      }
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item, index }: { item: ImageType; index: number }) => (
        <ImageCard
          item={item}
          index={index}
          onSelectImage={handleSelectedImage}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
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
    marginTop: 53.5,
  },
  textInput: {
    fontSize: hp(1.8),
    flex: 1,
    color: "black",
  },
});
