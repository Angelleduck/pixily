import { theme } from "@/constants/theme";
import { wp } from "@/helper/common";
import type { ImageType } from "@/types";
import { Octicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { File, Paths } from "expo-file-system";
import { Image } from "expo-image";
import { Asset, requestPermissionsAsync } from "expo-media-library";
import * as Sharing from "expo-sharing";
import {
  type ComponentRef,
  type RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";

interface MainImageProps {
  onSelectImage: (image: ImageType | null) => void;
  selectedImage: ImageType;
  targetRef: RefObject<ComponentRef<typeof View> | null>;
}

export function MainImage({
  onSelectImage,
  selectedImage,
  targetRef,
}: MainImageProps) {
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const { id, imageHeight, imageWidth, largeImageURL } = selectedImage;

  const getSize = useMemo(() => {
    const aspectRatio = Number(imageWidth) / Number(imageHeight);

    let calculatedHeight = wp(92) / aspectRatio;
    const calculatedWidth = wp(92);
    if (aspectRatio < 1) {
      calculatedHeight = calculatedHeight * aspectRatio;
    }
    return { height: calculatedHeight, width: calculatedWidth };
  }, [imageWidth, imageHeight]);

  const downloadImage = useCallback(async () => {
    const extension =
      new URL(largeImageURL).pathname.match(/\.(jpe?g|png|webp|gif)$/i)?.[1] ??
      "jpg";
    const destination = new File(Paths.cache, `pixily-${id}.${extension}`);
    return File.downloadFileAsync(largeImageURL, destination, { idempotent: true });
  }, [id, largeImageURL]);

  const handleSave = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      const permission = await requestPermissionsAsync(true, ["photo"]);
      if (!permission.granted) {
        Alert.alert("Permission needed", "Allow photo access to save images.");
        return;
      }

      const file = await downloadImage();
      await Asset.create(file.uri);
      try {
        file.delete();
      } catch (error) {
        console.warn("Could not remove cached image:", error);
      }
      Alert.alert("Saved!", "Image saved to Photos/Gallery.");
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Could not save the image.");
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }, [downloadImage]);

  const handleShare = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Unavailable", "Sharing is not available on this device.");
        return;
      }

      const file = await downloadImage();
      await Sharing.shareAsync(file.uri, {
        dialogTitle: "Share image",
        mimeType: file.type || undefined,
      });
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert("Error", "Could not share the image.");
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }, [downloadImage]);

  return (
    <BlurView
      blurTarget={targetRef}
      tint="systemMaterialLight"
      blurMethod="dimezisBlurViewSdk31Plus"
      intensity={20}
      style={{
        ...StyleSheet.absoluteFill,
        backgroundColor: "white",
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
          {Platform.OS !== "web" && (
            <>
              <Pressable
                accessibilityLabel="Save image"
                disabled={busy}
                onPress={handleSave}
                style={{
                  padding: 10,
                  backgroundColor: theme.Colors.neutral(0.6),
                  borderRadius: 10,
                }}
              >
                <Octicons name="download" size={24} color="white" />
              </Pressable>
              <Pressable
                accessibilityLabel="Share image"
                disabled={busy}
                onPress={handleShare}
                style={{
                  padding: 10,
                  backgroundColor: theme.Colors.neutral(0.6),
                  borderRadius: 10,
                }}
              >
                <Octicons name="share" size={24} color="white" />
              </Pressable>
            </>
          )}
        </View>
      </View>
    </BlurView>
  );
}
