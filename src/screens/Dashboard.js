import React from 'react';
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Alert } from "react-native";
const API_URL = "http://10.74.161.185:3000";

export default function Dashboard({ navigation }) {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clientUserId, setClientUserId] = useState(null);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            const storedUserId = await AsyncStorage.getItem("clientUserId");
            if (storedUserId) {
                setClientUserId(Number(storedUserId));
            }
        };
        loadUser();
    }, []);

    const fetchPlan = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/subscription/active/${clientUserId}`
            );

            // console.log("SUBSCRIPTION RESPONSE:", res.data);

            if (Array.isArray(res.data) && res.data.length > 0) {
                setPlan(res.data[0]);
            } else {
                setPlan(null);
            }
        } catch (err) {
            console.error("Failed to fetch subscription", err);
            setPlan(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clientUserId !== null) {
            setLoading(true);
            fetchPlan();
        }
        // console.log("USER ID FROM STORAGE:", clientUserId);

    }, [clientUserId]);

    const fetchUser = async (clientUserId) => {
        try {
            const res = await axios.get(`${API_URL}/auth/user/${clientUserId}`);
            setUserName(res.data.data.name);
        } catch (err) {
            console.error("Failed to fetch user", err);
        }
    };


    useEffect(() => {
        if (clientUserId !== null) {
            setLoading(true);
            fetchPlan();
            fetchUser(clientUserId);
        }
    }, [clientUserId]);


    const initReferralCode = async () => {
        const existingCode = await AsyncStorage.getItem('referralCode');

        if (!existingCode) {
            const newCode = 'FITG' + Math.floor(1000 + Math.random() * 9000);
            await AsyncStorage.setItem('referralCode', newCode);
        }
    };
    useEffect(() => {
        initReferralCode();
    }, []);

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
                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
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

            <Text style={styles.welcomeText}> Hi, {userName || "User"}!</Text>
            <Text style={styles.subtitle}>Welcome back to motivated Fitness GYM</Text>

            <View style={styles.planCard} key={plan?.id || "no-plan"}>

                <Text style={styles.planLabel}>Current Plan</Text>

                <Text style={styles.planValue}>
                    {loading
                        ? "Loading..."
                        : plan
                            ? plan.plan_name
                            : "No Active Plan"}
                </Text>

                <Text style={[styles.planLabel, { marginTop: 10 }]}>Status</Text>

                {loading ? (
                    <Text style={{ color: "#aaa" }}>Loading...</Text>
                ) : plan?.status === "active" ? (
                    <View style={styles.statusRow}>
                        <Ionicons name="ellipse" size={14} color="green" />
                        <Text style={styles.statusText}>Active</Text>
                    </View>
                ) : (
                    <Text style={{ color: "red" }}>No Active Subscription</Text>
                )}

                {!loading && plan?.status === "active" && (
                    <Text style={{ color: "#aaa", marginTop: 5 }}>
                        Expiry: {new Date(plan.end_date).toDateString()}
                    </Text>
                )}
            </View>

            {!plan || plan.status !== "active" ? (
                <TouchableOpacity
                    style={{ width: '100%' }}
                    onPress={() => navigation.navigate('ChoosePlan')}
                >
                    <LinearGradient
                        colors={['#0081d1', '#1bc97b']}
                        style={styles.buyBtn}
                    >
                        <Text style={styles.buyBtnText}>BUY PLAN</Text>
                    </LinearGradient>
                </TouchableOpacity>
            ) : null}


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
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#2f4cf4ff',
    },
    planLabel: {
        color: '#aaa',
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
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
});
