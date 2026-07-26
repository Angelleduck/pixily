import { useCallback, useRef } from "react";
import type { TrueSheet } from "@lodev09/react-native-true-sheet";

export function useModal() {
  const bottomSheetModalRef = useRef<TrueSheet>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  return {
    handleCloseModalPress,
    handlePresentModalPress,
    bottomSheetModalRef,
  };
}
