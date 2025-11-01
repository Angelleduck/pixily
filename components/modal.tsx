import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
import { Filter } from "./filter";

interface ModalProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  filters: Record<string, any>;
  handleFilterApply: () => void;
  handleFilterReset: () => void;
}
export default function Modal({
  bottomSheetModalRef,
  setFilters,
  filters,
  handleFilterApply,
  handleFilterReset,
}: ModalProps) {
  return (
    <BottomSheetModal
      enableDynamicSizing={false}
      index={0}
      snapPoints={["75%"]}
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
