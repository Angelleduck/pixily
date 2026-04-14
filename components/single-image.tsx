import { theme } from "@/constants/theme";
import { wp } from "@/helper/common";
import type { ImageType } from "@/types";
import { Octicons } from "@expo/vector-icons";
import BlurView from "@sbaiahmed1/react-native-blur";
import { Image } from "expo-image";
import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import RNBlobUtil from "react-native-blob-util";

interface MainImageProps {
  onSelectImage: (image: ImageType | null) => void;
  selectedImage: ImageType;
}

export function MainImage({ onSelectImage, selectedImage }: MainImageProps) {
  const [downloading, setDownloading] = useState(false);
  const { imageHeight, imageWidth, largeImageURL, pageURL } = selectedImage;

  const getSize = useMemo(() => {
    const aspectRatio = Number(imageWidth) / Number(imageHeight);

    let calculatedHeight = wp(92) / aspectRatio;
    const calculatedWidth = wp(92);
    if (aspectRatio < 1) {
      calculatedHeight = calculatedHeight * aspectRatio;
    }
    return { height: calculatedHeight, width: calculatedWidth };
  }, [imageWidth, imageHeight]);

  const handleDownload = useCallback(async () => {
    try {
      if (downloading) return;
      setDownloading(true);

      const imageName = pageURL.split("/").filter(Boolean).pop();
      const ext = new URL(largeImageURL).pathname.split(".").pop() ?? "jpg";
      const filename = `${imageName}.${ext}`;

      const { dirs } = RNBlobUtil.fs;

      await RNBlobUtil.config({
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mime: `image/${ext}`,
          title: filename,
          description: "Downloading image...",
          path: `${dirs.LegacyDownloadDir}/${filename}`,
          mediaScannable: true,
        },
      }).fetch("GET", largeImageURL);

      Alert.alert("Saved!", `Image saved to Downloads/${filename}`);
    } catch (error) {
      console.log("Download error:", error);
      Alert.alert("Error", "Download failed.");
    } finally {
      setDownloading(false);
    }
  }, [largeImageURL, downloading, pageURL]);

  return (
    <BlurView
      blurType="systemUltraThinMaterialDark"
      blurAmount={10}
      style={{
        ...StyleSheet.absoluteFill,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginInline: 10,
        }}
      >
        <View
          style={[
            getSize,
            {
              backgroundColor: "lightgray",
              borderRadius: 10,
              overflow: "hidden",
              marginBottom: 20,
            },
          ]}
        >
          <Image
            transition={150}
            style={{ width: "100%", height: "100%" }}
            source={largeImageURL}
            contentFit="cover"
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 50,
          }}
        >
          <Pressable
            onPress={() => onSelectImage(null)}
            style={{
              padding: 10,
              backgroundColor: theme.Colors.neutral(0.6),
              borderRadius: 10,
            }}
          >
            <Octicons name="x" size={24} color="white" />
          </Pressable>
          <Pressable
            onPress={() => handleDownload()}
            style={{
              padding: 10,
              backgroundColor: theme.Colors.neutral(0.6),
              borderRadius: 10,
            }}
          >
            <Octicons name="download" size={24} color="white" />
          </Pressable>
          <Pressable
            style={{
              padding: 10,
              backgroundColor: theme.Colors.neutral(0.6),
              borderRadius: 10,
            }}
          >
            <Octicons name="share" size={24} color="white" />
          </Pressable>
        </View>
      </View>
    </BlurView>
  );
}
