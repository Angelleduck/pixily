import { categories } from "@/constants/data";
import { theme } from "@/constants/theme";
import { memo } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

interface CategoriesProps {
  category: string;
  handleCategory: (item: string) => void;
}
interface CategoryItemProps {
  category: string;
  handleCategory: (item: string) => void;
  item: string;
  idx: number;
}

export const Categories = memo(function Categories({
  category,
  handleCategory,
}: CategoriesProps) {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filter}
    >
      {categories.map((item, idx) => (
        <CategoryItem
          key={idx}
          category={category}
          handleCategory={handleCategory}
          idx={idx}
          item={item}
        />
      ))}
    </ScrollView>
  );
});

const CategoryItem = ({
  category,
  handleCategory,
  item,
  idx,
}: CategoryItemProps) => {
  return (
    <Animated.View
      entering={FadeInRight.delay(idx * 200)
        .duration(1000)
        .springify()}
      style={[styles.categoryBox]}
    >
      <Pressable
        style={[
          styles.categoryButton,
          category === item && {
            backgroundColor: theme.Colors.neutral(0.8),
          },
        ]}
        onPress={() => {
          handleCategory(item);
        }}
      >
        <Text
          style={[
            styles.categoryText,
            category === item && {
              color: theme.Colors.white,
            },
          ]}
        >
          {item}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  filter: {
    gap: 5,
    marginBottom: 15,
  },
  categoryBox: {
    borderWidth: 1,
    borderColor: theme.Colors.neutral(0.2),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.Colors.white,
    overflow: "hidden",
  },
  categoryText: {
    fontWeight: theme.fontWeight.medium,
    color: theme.Colors.neutral(0.8),
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});
