import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";

export function useModal() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);
  return {
    handleCloseModalPress,
    handlePresentModalPress,
    bottomSheetModalRef,
  };
}
