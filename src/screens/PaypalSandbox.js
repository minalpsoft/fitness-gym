import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

WebBrowser.maybeCompleteAuthSession();

const MY_API = process.env.EXPO_PUBLIC_MY_API;

export default function PaypalSandbox({ route, navigation }) {
    const { planId, planName, price, durationDays } = route.params || {};

    const handlePayment = async () => {
        try {
            const clientUserId = await AsyncStorage.getItem("clientUserId");
            if (!clientUserId) throw new Error("User not logged in");

            // 1️⃣ Create PayPal order
            const orderRes = await axios.post(`${MY_API}paypal/create-order`, { amount: Number(price) });
            const approvalUrl = orderRes.data.approvalUrl;
            if (!approvalUrl) throw new Error("Approval URL not found");

            // 2️⃣ Open WebBrowser for PayPal
            const redirectUrl = Linking.createURL("success");
            const result = await WebBrowser.openAuthSessionAsync(approvalUrl, redirectUrl);

            if (result.type === "success") {
                const parsed = Linking.parse(result.url);
                const orderId = parsed.queryParams?.token;
                if (!orderId) throw new Error("Order ID not found");

                // 3️⃣ Capture PayPal payment
                const captureRes = await axios.post(`${MY_API}paypal/capture`, { orderId });
                if (captureRes.data.status !== "COMPLETED") throw new Error("Payment not completed");

                // 4️⃣ Save subscription
                const subRes = await axios.post(`${MY_API}subscription`, {
                    clientUserId: Number(clientUserId),
                    planId: Number(planId),
                    planName,
                    price: Number(price),
                    durationDays: Number(durationDays),
                });
                const subscriptionId = subRes.data.subscriptionId;

                if (!subscriptionId) throw new Error("Subscription creation failed");

                // 5️⃣ Save payment
                await axios.post(`${MY_API}payment`, {
                    clientUserId: Number(clientUserId),
                    planId: Number(planId),
                    subscriptionId: Number(subscriptionId),
                    amount: Number(price),
                    transactionId: orderId,
                    paymentStatus: "success",
                });

                // 6️⃣ Apply referral if exists
                const referralCode = await AsyncStorage.getItem("appliedReferralCode");
                const referrerId = await AsyncStorage.getItem("referrerId");

                if (referralCode && referrerId) {
                    try {
                        const refRes = await axios.post(`${MY_API}auth/apply-referral`, {
                            referrerId: Number(referrerId),
                            refereeId: Number(clientUserId),
                            planId: Number(planId),
                        });

                        if (refRes.data?.applied) {
                            console.log("Referral applied successfully");
                        } else {
                            console.log("Referral skipped:", refRes.data?.msg);
                        }

                        await AsyncStorage.removeItem("appliedReferralCode");
                        await AsyncStorage.removeItem("referrerId");

                    } catch (e) {
                        console.log("Referral apply failed:", e);
                    }
                }



                // console.log("Subscription payload:", {
                //     clientUserId: Number(clientUserId),
                //     planId: Number(planId),
                //     planName,
                //     price: Number(price),
                //     durationDays: Number(durationDays),
                // });
                // console.log("Payment payload:", {
                //     clientUserId: Number(clientUserId),
                //     planId: Number(planId),
                //     subscriptionId: Number(subscriptionId),
                //     amount: Number(price),
                //     transactionId: orderId,
                //     paymentStatus: "success",
                // });




                Alert.alert("Success 🎉", "Payment successful!", [
                    {
                        text: "OK",
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: "Dashboard",
                                        params: { refresh: true },
                                    },
                                ],
                            });
                        },
                    },
                ]);



            } else if (result.type === "cancel") {
                Alert.alert("Cancelled", "Payment cancelled");
            }

        } catch (err) {
            console.log("Payment Error:", err);
            Alert.alert("Error", "Payment or subscription failed");
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/gym_logo.jpg')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.title}>Complete Your Payment</Text>
            <Text style={styles.subtitle}>Securely pay with PayPal to activate your plan</Text>

            <View style={styles.card}>
                <Text style={styles.planLabel}>Plan</Text>
                <Text style={styles.planValue}>{planName}</Text>

                <Text style={styles.planLabel}>Price</Text>
                <Text style={styles.planValue}>€ {price}</Text>

                <Text style={styles.planLabel}>Duration</Text>
                <Text style={styles.planValue}>{durationDays} Days</Text>
            </View>

            <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
                <Text style={styles.payBtnText}>Pay with PayPal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#000',
        padding: 20,
        alignItems: 'center',
    },
    logoContainer: {
        marginTop: 30,
        marginBottom: 20,
    },
    logo: {
        height: 200,
        width: 200
    },
    title: {
        fontSize: 24,
        color: "#20e880",
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#aaa",
        marginBottom: 20,
        textAlign: "center",
    },
    card: {
        width: "100%",
        backgroundColor: "#1c1c1c",
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: "#20e880",
    },
    planLabel: {
        color: "#aaa",
        fontSize: 14,
        marginTop: 10,
    },
    planValue: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 2,
    },
    payBtn: {
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#0070ba",
        marginBottom: 15,
    },
    payBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    cancelBtn: {
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#444",
    },
    cancelBtnText: {
        color: "#fff",
        fontSize: 16,
    },
});
