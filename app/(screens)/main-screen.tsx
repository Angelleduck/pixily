import { Gallery } from "@/components/gallery";
import { MainHeader } from "@/components/main-header";
import Modal from "@/components/modal";
import { MainImage } from "@/components/single-image";
import { useFetch } from "@/hooks/useFetch";
import { useImage } from "@/hooks/useImage";
import { useModal } from "@/hooks/useModal";
import { BlurTargetView } from "expo-blur";
import { type ComponentRef, useCallback, useEffect, useRef } from "react";
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
    draftFilters,
    setDraftFilters,
    resetFilterDraft,
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

  const handleSearchRef = useRef(handleSearch);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    handleSearchRef.current = handleSearch;
  }, [handleSearch]);
  useEffect(
    () => () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    },
    [],
  );

  const debouncedHandleSearch = useCallback((text: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(
      () => handleSearchRef.current(text),
      600,
    );
  }, []);

  const openFilters = useCallback(() => {
    resetFilterDraft();
    handlePresentModalPress();
  }, [resetFilterDraft, handlePresentModalPress]);

  const targetRef = useRef<ComponentRef<typeof View> | null>(null);

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
                handlePresentModalPress={openFilters}
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
                filters={draftFilters}
                handleFilterApply={handleFilterApply}
                handleFilterReset={handleFilterReset}
                setFilters={setDraftFilters}
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
