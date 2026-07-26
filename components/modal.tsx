import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { type RefObject, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Filter } from "./filter";

interface ModalProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  filters: Record<string, any>;
  handleFilterApply: () => void;
  handleFilterReset: () => void;
  targetRef: RefObject<View | null>;
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
      <>
        {/* <BlurView
          tint="light"
          // blurTarget={targetRef}
          blurMethod="dimezisBlurView"
          intensity={20}
          style={{
            ...StyleSheet.absoluteFill,
          }}
        /> */}
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0}
        />
      </>
    ),
    [],
  );

  return (
    <BottomSheetModal
      enableDynamicSizing={false}
      index={0}
      snapPoints={["75%"]}
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
