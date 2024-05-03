import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { forwardRef } from "react";

type ButtonProps = {
  width: string | number;
  text: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, width, ...pressableProps }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        style={[styles.container, width && { width }]}
      >
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    alignItems: "center",
    borderRadius: 20,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default Button;
