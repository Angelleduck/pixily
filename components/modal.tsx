import { TrueSheet } from "@lodev09/react-native-true-sheet";
import type { RefObject } from "react";
import { StyleSheet, type View } from "react-native";
import { Filter } from "./filter";

interface ModalProps {
  bottomSheetModalRef: React.RefObject<TrueSheet | null>;
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
}: ModalProps) {
  return (
    <TrueSheet
      style={styles.modal}
      ref={bottomSheetModalRef}
      detents={[0.6, 1]}
      cornerRadius={24}
      backgroundColor={"white"}
    >
      <Filter
        handleFilterApply={handleFilterApply}
        handleFilterReset={handleFilterReset}
        setFilters={setFilters}
        filters={filters}
      />
    </TrueSheet>
  );
}
const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    paddingTop: 35,
  },
});
