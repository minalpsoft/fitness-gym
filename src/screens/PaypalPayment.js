import React from "react";
import { ActivityIndicator, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { View, Text, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export default function PaypalPayment({ route }) {

  const {
    planName,
    price,
    days,
    expiryDate
  } = route.params || {};

  const paypalHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta 
      name="viewport" 
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />

    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        font-family: Arial, sans-serif;
        -webkit-text-size-adjust: 100%;
        background-color: #f7f7f7;
      }

      .page {
       padding: 24px;
        display: flex;
        justify-content: center;
      }

      .container {
        width: 100%;
        max-width: 420px;
        margin: 0 auto;
        background: #fff;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.08);
      }

      .block {
        margin-bottom: 28px;
      }
    </style>

    <script src="https://www.paypal.com/sdk/js?client-id=BAAMyKuyXUGSBFI25VSioxopWQPu2V8M4nXNtJvocT3r5ozS7cZ2XXf59WeHlBs_hIEdwnWi00lDkcT-Cw&components=hosted-buttons&disable-funding=venmo&currency=EUR"></script>
  </head>

  <body>
    <div class="page">
      <div class="container">

        <div class="block" id="paypal-container-9PRJ96HVDSCTJ"></div>
        <script>
          paypal.HostedButtons({
            hostedButtonId: "9PRJ96HVDSCTJ"
          }).render("#paypal-container-9PRJ96HVDSCTJ");
        </script>

        <div class="block" id="paypal-container-GZSMMJF6EKLS8"></div>
        <script>
          paypal.HostedButtons({
            hostedButtonId: "GZSMMJF6EKLS8"
          }).render("#paypal-container-GZSMMJF6EKLS8");
        </script>

      </div>
    </div>
  </body>
</html>
`;


  // return (
  //     <WebView
  //         originWhitelist={["*"]}
  //         source={{ html: paypalHTML }}
  //         javaScriptEnabled
  //         domStorageEnabled
  //         scalesPageToFit={false}
  //         startInLoadingState
  //         renderLoading={() => (
  //             <ActivityIndicator size="large" style={{ marginTop: 40 }} />
  //         )}
  //         style={{ width }}
  //     />
  // );

  return (
    <View style={{ flex: 1 }}>
      
      <View style={styles.planBox}>
        
          <Text style={styles.title}>Selected Plan</Text>

          <Text style={styles.text}>
            Plan: {planName ?? "N/A"}
          </Text>

          <Text style={styles.text}>
            Price: Rs. {price ?? "0"}
          </Text>

          <Text style={styles.expire}>
            Expires on: {expiryDate ?? "—"}
          </Text>

      </View>

      <WebView
        originWhitelist={["*"]}
        source={{ html: paypalHTML }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}
        style={{ width, flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  planBox: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 20,
    borderRadius: 10,
    elevation: 3,
    marginTop: 50
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
  },
  expire: {
    fontSize: 13,
    color: "#0081d1",
    marginTop: 4,
  },
});

