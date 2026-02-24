import { categories } from "@/constants/data";
import { theme } from "@/constants/theme";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

interface CategoriesProps {
  category: string;
  handleCategory: (item: string) => void;
}

export function Categories({ category, handleCategory }: CategoriesProps) {
  console.log("cate re-render");
  const categoryItems = useMemo(() => {
    return categories.map((item, idx) => (
      <Animated.View
        entering={FadeInRight.delay(idx * 200)
          .duration(1000)
          .springify()}
        key={item}
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
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filter}
    >
      {categoryItems}
    </ScrollView>
  );
}

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
