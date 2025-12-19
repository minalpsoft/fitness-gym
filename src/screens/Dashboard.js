import React from 'react';
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard({ navigation }) {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const res = await axios.get(
                    `http://10.74.161.185:3000/subscription/active/${userId}`
                );

                setPlan(res.data);
            } catch (err) {
                setPlan(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, []);

    // referral code below
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

            <Text style={styles.welcomeText}>Hi, Mitesh!</Text>
            <Text style={styles.subtitle}>Welcome back to motivated Fitness GYM</Text>

            <View style={styles.planCard}>
                <Text style={styles.planLabel}>Current Plan</Text>
                <Text style={styles.planValue}>
                    {plan ? plan.planName : "No Active Plan"}
                </Text>

                <Text style={[styles.planLabel, { marginTop: 10 }]}>Status</Text>

                {!loading && (
                    <View style={styles.statusRow}>
                        <Ionicons
                            name="ellipse"
                            size={14}
                            color={plan?.status === "ACTIVE" ? "green" : "red"}
                        />
                        <Text style={styles.statusText}>
                            {plan?.status === "ACTIVE" ? "Active" : "Inactive"}
                        </Text>
                    </View>
                )}

                {plan && (
                    <Text style={{ color: "#aaa", marginTop: 5 }}>
                        Expiry: {new Date(plan.expiryDate).toDateString()}
                    </Text>
                )}

            </View>

            {plan?.status !== "ACTIVE" && (
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
            )}


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

                <TouchableOpacity style={styles.menuItem}>
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
