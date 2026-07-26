import {
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { useCallback, type RefObject } from "react";
import { StyleSheet, type View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
} from "react-native-reanimated";
import { Filter } from "./filter";

interface ModalProps {
  bottomSheetModalRef: RefObject<BottomSheetModal | null>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  filters: Record<string, any>;
  handleFilterApply: () => void;
  handleFilterReset: () => void;
  targetRef: RefObject<View | null>;
}

// Animatable BlurView
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// Separate component so hooks follow the rules of hooks cleanly
function AnimatedBackdrop({
  animatedIndex,
  targetRef,
}: BottomSheetBackdropProps & { targetRef: RefObject<View | null> }) {
  const animatedProps = useAnimatedProps(() => ({
    intensity: interpolate(
      animatedIndex.value,
      [-1, 0], // input range: closed -> fully open at index 0
      [0, 20], // output range: intensity 0 -> 20
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <AnimatedBlurView
      tint="light"
      blurTarget={targetRef}
      blurMethod="dimezisBlurView"
      animatedProps={animatedProps}
      style={StyleSheet.absoluteFill}
    />
  );
}

export default function Modal({
  bottomSheetModalRef,
  setFilters,
  filters,
  handleFilterApply,
  handleFilterReset,
  targetRef,
}: ModalProps) {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <AnimatedBackdrop {...props} targetRef={targetRef} />
    ),
    [targetRef],
  );

  return (
    <BottomSheetModal
      enableDynamicSizing={false}
      index={0}
      snapPoints={["60%"]}
      backdropComponent={renderBackdrop}
      ref={bottomSheetModalRef}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Filter
          handleFilterApply={handleFilterApply}
          handleFilterReset={handleFilterReset}
          setFilters={setFilters}
          filters={filters}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
