import { filters as filterList } from "@/constants/data";
import { theme } from "@/constants/theme";
import { capitalize } from "@/helper/common";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface FilterProps {
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  filters: Record<string, any>;
  handleFilterApply: () => void;
  handleFilterReset: () => void;
}

interface CommonSectionProps {
  item: string;
  onSelect: (item: string, filterName: string) => void;
  filterName: string;
  isActive: boolean;
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

function CommonSection({
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
        style={(styles.filterText, isActive && { color: theme.Colors.white })}
      >
        {capitalize(item)}
      </Text>
    </Pressable>
  );
}
function ColorSection({
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
  container: { paddingHorizontal: 20, paddingVertical: 10 },
  title: {
    color: theme.Colors.neutral(0.8),
    fontSize: 30,
    fontWeight: theme.fontWeight.bold,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: 8,
    color: theme.Colors.neutral(0.8),
  },
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
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    rowGap: 12,
    marginBottom: 10,
  },
  filterText: {
    color: theme.Colors.neutral(0.7),
  },
  colorContainer: {
    borderColor: "white",
    borderWidth: 2,
    marginRight: 4,
    padding: 2,
    borderRadius: theme.radius.sm,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 15,
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
