import React from "react";
import { View, TouchableOpacity, Text, Linking } from "react-native";

export default function PaypalPayment() {

  const payWeekPass = () => {
    Linking.openURL("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=9PRJ96HVDSCTJ");
  };

  const payDayPass = () => {
    Linking.openURL("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=GZSMMJF6EKLS8");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>

      <TouchableOpacity
        onPress={payWeekPass}
        style={{
          backgroundColor: "#ffc439",
          padding: 16,
          borderRadius: 8,
          marginBottom: 16
        }}
      >
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
          Pay Week Pass (€35)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={payDayPass}
        style={{
          backgroundColor: "#ffc439",
          padding: 16,
          borderRadius: 8
        }}
      >
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
          Pay 1 Day Pass (€12)
        </Text>
      </TouchableOpacity>

    </View>
  );
}
