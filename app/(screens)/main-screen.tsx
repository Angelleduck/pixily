import { Gallery } from "@/components/gallery";
import { MainHeader } from "@/components/main-header";
import Modal from "@/components/modal";
import { MainImage } from "@/components/single-image";
import { debounce } from "@/helper/utils";
import { useFetch } from "@/hooks/useFetch";
import { useImage } from "@/hooks/useImage";
import { useModal } from "@/hooks/useModal";
import { BlurTargetView } from "expo-blur";
import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
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

  const debouncedHandleSearch = debounce(handleSearch, 600);

  const targetRef = useRef<View | null>(null);

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
        <BlurTargetView ref={targetRef} style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={styles.container}>
              <MainHeader
                isHide={isHide}
                handlePresentModalPress={handlePresentModalPress}
                scrollToTop={scrollToTop}
              />
              <Gallery
                images={images}
                category={category}
                debouncedHandleSearch={debouncedHandleSearch}
                flashListRef={flashListRef}
                handleCategory={handleCategory}
                handleLoadMore={handleLoadMore}
                handleRefreshing={handleRefreshing}
                handleSelectedImage={handleSelectedImage}
                loadingMore={loadingMore}
                onScroll={onScroll}
                refreshing={refreshing}
              />
              <Modal
                filters={filters}
                handleFilterApply={handleFilterApply}
                handleFilterReset={handleFilterReset}
                setFilters={setFilters}
                bottomSheetModalRef={bottomSheetModalRef}
                targetRef={targetRef}
              />
            </View>
          </SafeAreaView>
        </BlurTargetView>
        {selectedImage && (
          <MainImage
            onSelectImage={handleSelectedImage}
            selectedImage={selectedImage}
            targetRef={targetRef}
          />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
});
