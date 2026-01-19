import { filters as filterList } from "@/constants/data";
import { theme } from "@/constants/theme";
import { capitalize } from "@/helper/common";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ColorSection, CommonSection } from "./sections";

interface FilterProps {
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  filters: Record<string, any>;
  handleFilterApply: () => void;
  handleFilterReset: () => void;
}

const filterKeys = Object.keys(filterList) as (keyof typeof filterList)[];
export function Filter({
  setFilters,
  filters,
  handleFilterApply,
  handleFilterReset,
}: FilterProps) {
  const onSelect = (item: string, filterName: string) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filters</Text>
      {filterKeys.map((key) => (
        <View key={key}>
          <Text style={styles.subtitle}>
            {key === "image_type" ? "Type" : capitalize(key)}
          </Text>
          <View style={styles.filterContainer}>
            {key !== "colors"
              ? filterList[key].map((item: string) => (
                  <CommonSection
                    filterName={key}
                    onSelect={onSelect}
                    item={item}
                    key={item}
                    isActive={filters[key] === item}
                  />
                ))
              : filterList[key].map((item) => (
                  <ColorSection
                    filterName={key}
                    isActive={filters[key] === item}
                    onSelect={onSelect}
                    item={item}
                    key={item}
                  />
                ))}
          </View>
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleFilterReset}
          style={[
            styles.buttonSet,
            { backgroundColor: theme.Colors.neutral(0.03) },
          ]}
        >
          <Text style={{ color: "black", fontSize: 18 }}>Reset</Text>
        </Pressable>
        <Pressable
          onPress={handleFilterApply}
          style={[
            styles.buttonSet,
            { backgroundColor: theme.Colors.neutral(0.8) },
          ]}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
            }}
          >
            Apply
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 3 },
  title: {
    color: theme.Colors.neutral(0.8),
    fontSize: 30,
    fontWeight: theme.fontWeight.bold,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: 8,
    color: theme.Colors.neutral(0.8),
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    rowGap: 4,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  buttonSet: {
    paddingVertical: 10,
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: theme.Colors.neutral(0.3),
    borderRadius: theme.radius.sm,
  },
});
