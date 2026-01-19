import { theme } from "@/constants/theme";
import { capitalize } from "@/helper/common";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CommonSectionProps {
  item: string;
  onSelect: (item: string, filterName: string) => void;
  filterName: string;
  isActive: boolean;
}

export function CommonSection({
  item,
  onSelect,
  filterName,
  isActive,
}: CommonSectionProps) {
  return (
    <Pressable
      style={[
        styles.buttonFilter,
        isActive && { backgroundColor: theme.Colors.neutral(0.6) },
      ]}
      onPress={() => {
        onSelect(item, filterName);
      }}
    >
      <Text
        style={[styles.filterText, isActive && { color: theme.Colors.white }]}
      >
        {capitalize(item)}
      </Text>
    </Pressable>
  );
}
export function ColorSection({
  item,
  onSelect,
  filterName,
  isActive,
}: CommonSectionProps) {
  return (
    <View
      style={[
        styles.colorContainer,
        isActive && { borderColor: theme.Colors.neutral(0.4) },
      ]}
    >
      <Pressable
        style={[
          {
            backgroundColor: item,
          },
          styles.buttonColorFilter,
        ]}
        onPress={() => {
          onSelect(item, filterName);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonFilter: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.Colors.neutral(0.3),
    borderRadius: theme.radius.sm,
  },
  buttonColorFilter: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  filterText: {
    color: theme.Colors.neutral(0.7),
  },
  colorContainer: {
    borderColor: "white",
    borderWidth: 2,
    padding: 2,
    borderRadius: theme.radius.sm,
  },
});
