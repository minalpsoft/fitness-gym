import React from 'react';
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useEffect } from 'react';
const MY_API = process.env.EXPO_PUBLIC_MY_API;

export default function MakePayment({ navigation, route }) {

    const { planId, planName, price, expiryDate, durationDays, onPaymentSuccess } = route.params || {};
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(price);
    const [couponApplied, setCouponApplied] = useState(false);
    const [hasReferrerReward, setHasReferrerReward] = useState(false);

    const applyCoupon = async () => {
        if (!coupon) {
            Alert.alert("Error", "Please enter a referral code");
            return;
        }

        try {
            const clientUserId = await AsyncStorage.getItem("clientUserId");

            const res = await axios.post(`${MY_API}auth/validate-referral`, {
                code: coupon,
                planId,
                durationDays,
                refereeId: Number(clientUserId)
            });

            if (!res.data.valid) {
                Alert.alert("Invalid Code", res.data.msg || "Referral invalid");
                return;
            }

            if (durationDays !== 30) {
                Alert.alert("Not Applicable", "Referral only for 1-month plan");
                return;
            }

            // ✅ SAVE referral for payment step
            await AsyncStorage.setItem("appliedReferralCode", coupon);
            await AsyncStorage.setItem("referrerId", String(res.data.referrerId));

            const discountedAmount = price / 2;
            setDiscount(price - discountedAmount);
            setFinalAmount(discountedAmount);
            setCouponApplied(true);

            Alert.alert("Success", `Referral applied! You pay €${discountedAmount}`);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to apply referral code");
        }
    };

    useEffect(() => {
        const checkReferrerReward = async () => {
            const clientUserId = await AsyncStorage.getItem("clientUserId");
            if (!clientUserId) return;

            try {
                const res = await axios.get(`${MY_API}payment/referrer-discount/${clientUserId}`);
                setHasReferrerReward(res.data.hasReward);
            } catch (e) {
                console.log("Reward check failed", e);
            }
        };

        checkReferrerReward();
    }, []);

    useEffect(() => {
        if (hasReferrerReward && !couponApplied) {
            const discounted = price / 2;
            setDiscount(price - discounted);
            setFinalAmount(discounted);
        }
    }, [hasReferrerReward]);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.removeItem("clientUserId");
                        await AsyncStorage.removeItem("referralCode");

                        navigation.reset({
                            index: 0,
                            routes: [{ name: "LoginScreen" }],
                        });
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.backContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={28} color="#20e880ff" />
                </TouchableOpacity>
            </View>

            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/gym_logo.jpg')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.welcomeText}>Make Payment</Text>
            <Text style={styles.subtitle}>Select your membership duration</Text>

            <View style={styles.selectedPlan}>
                <Text style={styles.selectedText}>Selected Plan: {planName}</Text>

                {(couponApplied || hasReferrerReward) ? (
                    <>
                        <Text style={styles.originalPrice}>€ {price}</Text>

                        <Text style={styles.finalAmountText}>
                            You Pay: € {finalAmount}
                        </Text>

                        {couponApplied && (
                            <Text style={styles.rewardText}>
                                🎉 Referral applied
                            </Text>
                        )}

                        {!couponApplied && hasReferrerReward && (
                            <Text style={styles.rewardText}>
                                🎉 Referral reward applied
                            </Text>
                        )}
                    </>
                ) : (
                    <Text style={styles.finalAmountText}>€ {finalAmount}</Text>
                )}
            </View>

            <View style={{ width: "100%", alignItems: "flex-start" }}>
                <Text style={styles.expireText}>
                    Expire On: {expiryDate}
                </Text>
            </View>

            <View style={styles.planCard}>
                <Ionicons name="pricetag" size={18} color="green" />

                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={[styles.couponInput, { flex: 1 }]}
                        placeholder="Apply Coupon"
                        placeholderTextColor="#777"
                        value={coupon}
                        onChangeText={setCoupon}
                        editable={!couponApplied && !hasReferrerReward}
                    />

                    <TouchableOpacity
                        style={styles.applyBtn}
                        onPress={applyCoupon}
                        disabled={couponApplied || hasReferrerReward}
                    >
                        <Text style={styles.applyBtnText}>
                            {hasReferrerReward
                                ? "Reward Applied"
                                : couponApplied
                                    ? "Applied"
                                    : "Apply"}
                        </Text>

                    </TouchableOpacity>
                </View>
            </View>

            {hasReferrerReward && (
                <Text style={{ color: "#20e880", fontSize: 12, marginTop: 5, marginBottom: 10 }}>
                    Your referral reward is automatically applied.
                </Text>
            )}

            <TouchableOpacity
                style={{ width: "100%" }}
                onPress={() =>
                    // Pass only serializable data
                    navigation.navigate("PaypalSandbox", {
                        planId: route.params.planId,
                        planName,
                        price: finalAmount,
                        durationDays,
                        expiryDate,
                    })
                }
            >
                <LinearGradient
                    colors={['#0081d1', '#1bc97b']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.buyBtn}
                >
                    <Text style={styles.buyBtnText}>PAY NOW</Text>
                </LinearGradient>
            </TouchableOpacity>



            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Dashboard')}>
                    <MaterialCommunityIcons name="view-dashboard-outline" size={20} color="green" />
                    <Text style={styles.menuText}>Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UpdateProfile')}>
                    <Ionicons name="person-circle-outline" size={20} color="green" />
                    <Text style={styles.menuText}>Update Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PaymentHistory')}>
                    <FontAwesome5 name="money-check-alt" size={20} color="green" />
                    <Text style={styles.menuText}>Payment History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ReferralCode')}>
                    <MaterialCommunityIcons name="qrcode-scan" size={20} color="green" />
                    <Text style={styles.menuText}>My Referral Code</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="green" />
                    <Text style={styles.menuText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    backContainer: {
        width: '100%',
        paddingVertical: 10,
        alignItems: 'flex-start',
        // marginBottom: 10,
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        padding: 20,
    },
    logoContainer: {
        marginTop: 30,
        marginBottom: 20,
    },
    logo: {
        height: 200,
        width: 200
    },
    welcomeText: {
        fontSize: 30,
        color: '#20e880ff',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 5,
        fontFamily: 'Poppins_400Regular',
    },
    subtitle: {
        fontSize: 14,
        color: '#aaa',
        alignSelf: 'flex-start',
        marginBottom: 20,
        fontFamily: 'Poppins_400Regular',
    },
    planCard: {
        width: '100%',
        backgroundColor: '#111',
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#2f4cf4ff',
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    couponInput: {
        flex: 1,
        marginLeft: 10,
        color: "#fff",
        fontSize: 16,
        paddingVertical: 6,
    },

    planLabel: {
        color: '#aaa',
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        marginLeft: 7
    },
    planValue: {
        color: '#285ae3ff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins_400Regular',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    statusText: {
        color: 'green',
        fontSize: 14,
        marginLeft: 5,
        fontFamily: 'Poppins_400Regular',
    },
    selectedPlan: {
        width: '100%',
        backgroundColor: '#111', // dark card
        borderRadius: 12,
        padding: 15,
        marginVertical: 15,
        borderWidth: 1,
        borderColor: '#2f4cf4ff',
        // Flex column to stack prices vertically
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6, // space between texts
    },

    selectedText: {
        color: '#20e880ff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Poppins_400Regular',
    },

    originalPrice: {
        color: '#ff4d4d', // red strike-through
        fontSize: 14,
        textDecorationLine: 'line-through',
        fontFamily: 'Poppins_400Regular',
    },

    discountText: {
        color: '#00ff88', // green for discount
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
    },

    finalAmountText: {
        color: '#20e880ff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins_600SemiBold',
    },
    originalPrice: {
        color: "#ff4d4d",
        textDecorationLine: "line-through",
        fontSize: 14,
        marginTop: 4,
    },

    finalAmountText: {
        color: "#20e880",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 4,
    },

    rewardText: {
        color: "#20e880",
        fontSize: 12,
        marginTop: 2,
    },

    expireText: {
        color: '#aaa',
        fontSize: 12,
        textAlign: "left",
        padding: 10,
        fontFamily: 'Poppins_400Regular',
    },
    buyBtn: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buyBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Poppins_600SemiBold',
    },
    menu: {
        width: '100%',
        marginBottom: 50

    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        // borderBottomWidth: 1,
        // borderBottomColor: '#222',
    },
    menuText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 15,
        fontFamily: 'Poppins_400Regular',
    },
    couponInput: {
        borderWidth: 1,
        // borderColor: '#2f4cf4ff',
        borderRadius: 8,
        padding: 10,
        marginRight: 10,
        color: '#ffffff',
    },

    applyBtn: {
        backgroundColor: '#20e880ff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },

    applyBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },

});
