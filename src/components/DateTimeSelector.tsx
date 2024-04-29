import React from "react";
import { Button, Pressable, Text, StyleSheet, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Colors from "@/constants/Colors";
interface DateTimeSelectorProps {
  show: boolean;
  setShow: (show: boolean) => void;
  date: Date;
  setDate: (date: Date) => void;
  mode: "date" | "time";
  setMode: (mode: "date" | "time") => void;
}
const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  show,
  setShow,
  date,
  setDate,
  mode,
  setMode,
}) => {
  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.btn}>
        <Button
          color={Colors.light.tabIconSelected}
          onPress={() => showMode("date")}
          title="Choose Date"
        />
      </Pressable>
      <Pressable>
        <Button
          color={Colors.light.tabIconSelected}
          onPress={() => showMode("time")}
          title="Choose Time"
        />
      </Pressable>
      <Text style={styles.txt}>Order Date: {date.toLocaleString()}</Text>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  btn: {
    marginVertical: 8,
    paddingVertical: 4,
  },
  txt: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "bold",
  },
});

export default DateTimeSelector;
