import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clock App</Text>
      <Text style={styles.subtitle}>Welcome to my clock application</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101114",
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    color: "#a7a7ad",
    fontSize: 16,
    marginTop: 10,
  },
});
