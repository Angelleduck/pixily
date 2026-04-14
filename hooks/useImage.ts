import { getImages } from "@/service/apiImage";
import type { ImageType } from "@/types";
import type { FlashListRef } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

export function useImage() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHide, setIsHide] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const flashListRef = useRef<FlashListRef<ImageType>>(null);
  const lastScrollY = useRef(0);
  useEffect(() => {
    async function fetchData() {
      const data = await getImages({});
      setImages(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 130);
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (selectedImage) {
        setSelectedImage(null);
        return true; // true = event handled, don't go back
      }
      return false; // false = let the default back action happen
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );
    return () => subscription.remove();
  }, [selectedImage]);

  const scrollToTop = () => {
    flashListRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = e.nativeEvent.contentOffset.y;

    if (scrollOffset > lastScrollY.current && scrollOffset > 30) {
      setIsHide(true);
    } else {
      setIsHide(false);
    }

    lastScrollY.current = scrollOffset;
  };

  const handleSelectedImage = (image: ImageType | null) => {
    setSelectedImage(image);
  };

  return {
    images,
    setImages,
    selectedImage,
    handleSelectedImage,
    isLoading,
    flashListRef,
    scrollToTop,
    onScroll,
    isHide,
  };
}
