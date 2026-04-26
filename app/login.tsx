import { Button, ButtonText } from "@/components/ui/button";
import { StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View>
      <Text style={styles.text}>About screen</Text>
      <Button variant="solid" size="md" action="primary">
        <ButtonText>Click me</ButtonText>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
