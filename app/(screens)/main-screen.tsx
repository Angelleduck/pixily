import { Categories } from "@/components/categories";
import { ImageCard } from "@/components/image-card";
import Modal from "@/components/modal";
import { MainImage } from "@/components/single-image";
import { theme } from "@/constants/theme";
import { hp } from "@/helper/common";
import { debounce } from "@/helper/utils";
import { useFetch } from "@/hooks/useFetch";
import { useImage } from "@/hooks/useImage";
import { useModal } from "@/hooks/useModal";
import type { ImageType } from "@/types";
import { FontAwesome6 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const {
    images,
    setImages,
    isLoading,
    selectedImage,
    handleSelectedImage,
    scrollToTop,
    flashListRef,
    onScroll,
    isHide,
  } = useImage();

  const {
    handleCloseModalPress,
    handlePresentModalPress,
    bottomSheetModalRef,
  } = useModal();

  const {
    category,
    filters,
    setFilters,
    handleSearch,
    handleCategory,
    handleLoadMore,
    loadingMore,
    handleFilterApply,
    handleFilterReset,
    refreshing,
    handleRefreshing,
  } = useFetch({
    setImages,
    handleCloseModalPress,
    scrollToTop,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleSearch = useCallback(debounce(handleSearch, 600), [
    handleSearch,
  ]);

  //later : I try to work on perf later build with eas and check how is it.
  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flex: 1,
        }}
      >
        <Text>Loading</Text>
      </SafeAreaView>
    );
  } else {
    return (
      <>
        <SafeAreaView style={styles.container}>
          <View
            style={[{ zIndex: 5 }, isHide ? { opacity: 0 } : { opacity: 1 }]}
          >
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
                  />
                </View>
                <View>
                  <Categories
                    category={category}
                    handleCategory={handleCategory}
                  />
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
            renderItem={({
              item,
              index,
            }: {
              item: ImageType;
              index: number;
            }) => (
              <ImageCard
                item={item}
                index={index}
                onSelectImage={handleSelectedImage}
              />
            )}
          />
          <Modal
            filters={filters}
            handleFilterApply={handleFilterApply}
            handleFilterReset={handleFilterReset}
            setFilters={setFilters}
            bottomSheetModalRef={bottomSheetModalRef}
          />
        </SafeAreaView>
        {selectedImage && (
          <MainImage
            onSelectImage={handleSelectedImage}
            selectedImage={selectedImage}
          />
        )}
      </>
    );
  }
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
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "#f0f0f0",
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
    marginTop: 53.5,
  },
  textInput: {
    fontSize: hp(1.8),
    flex: 1,
  },
});
