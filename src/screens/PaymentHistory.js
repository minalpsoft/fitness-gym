import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const MY_API = process.env.EXPO_PUBLIC_MY_API;
import axios from 'axios';
export default function PaymentHistory({ navigation }) {

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

    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const userId = await AsyncStorage.getItem('clientUserId');

            const res = await fetch(`${MY_API}payment/user/${userId}`);
            const data = await res.json();

            console.log('PAYMENTS API RESPONSE =>', data);

            if (Array.isArray(data)) {
                setPayments(data);
            } else if (Array.isArray(data?.data)) {
                setPayments(data.data);
            } else {
                setPayments([]);
            }
        } catch (err) {
            console.log(err);
            Alert.alert('Error', 'Failed to load payment history');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.backContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
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

            <Text style={styles.welcomeText}>Payment History</Text>

            <View style={styles.planCard}>

                {/* Header */}
                <View style={styles.row}>
                    <Text style={styles.planLabel}>Date</Text>
                    <Text style={styles.planLabel}>Time</Text>
                    <Text style={styles.planLabel}>Amount</Text>
                </View>

                {payments.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>
                        No payments found
                    </Text>
                ) : (
                    payments.map((item, index) => {
                        const dateObj = new Date(item.payment_datetime);

                        return (
                            <View style={styles.row} key={index}>
                                <Text style={styles.valueText}>
                                    {dateObj.toLocaleDateString()}
                                </Text>
                                <Text style={styles.valueText}>
                                    {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                                <Text style={styles.valueText}>
                                    ₹ {item.amount}
                                </Text>
                            </View>
                        );
                    })
                )}
            </View>


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
        marginBottom: 20,
        fontFamily: 'Poppins_400Regular',
    },
    planCard: {
        width: '100%',
        backgroundColor: '#111',
        borderRadius: 15,
        padding: 18,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#2f4cf4',
        flexDirection: "row",
        justifyContent: "space-between",
    },

    leftColumn: {
        width: "50%",
    },

    rightColumn: {
        width: "50%",
        alignItems: "flex-end",
    },

    planLabel: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 8,
        fontFamily: "Poppins_400Regular",
    },

    valueText: {
        fontSize: 15,
        color: 'white',
        marginBottom: 8,
        fontFamily: "Poppins_600SemiBold",
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
