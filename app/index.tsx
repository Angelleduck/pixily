import { theme } from "@/constants/theme";
import { hp, wp } from "@/helper/common";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Image
        style={styles.image}
        source={require("../assets/images/home-image.jpg")}
      />
      <LinearGradient
        style={styles.gradient}
        colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.5)", "white"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
      />
      <SafeAreaView style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={styles.container}>
          <Animated.Text
            entering={FadeInDown.delay(400).springify()}
            style={styles.title}
          >
            Pixily
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(500).springify()}
            style={styles.subtitle}
          >
            Every pixel tells a story
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <Pressable
              onPress={() => {
                router.navigate("/(screens)/main-screen");
              }}
              style={styles.buttonContainer}
            >
              <Text style={styles.buttonText}>Start Exploring</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
  },
  title: {
    fontSize: hp(7),
    fontWeight: theme.fontWeight.bold,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: hp(2),
    fontWeight: theme.fontWeight.medium,
    marginBottom: 20,
  },
  buttonContainer: {
    backgroundColor: theme.Colors.Black,
    padding: 15,
    paddingHorizontal: 90,
    alignItems: "center",
    display: "flex",
    borderRadius: theme.radius.xl,
  },
  buttonText: {
    color: theme.Colors.white,
    fontSize: hp(2.8),
    fontWeight: theme.fontWeight.medium,
  },
  container: {
    alignItems: "center",
    marginBottom: 50,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    height: hp(65),
    width: wp(100),
  },
});
