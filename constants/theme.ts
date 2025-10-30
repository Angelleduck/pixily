enum WeightProps {
  medium = "500",
  semibold = "600",
  bold = "700",
}

export const theme = {
  Colors: {
    white: "#fff",
    Black: "#000",
    gray: (value: number) => `rgba(10,10,10,${value})`,
  },
  fontWeight: WeightProps,
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
  },
};
