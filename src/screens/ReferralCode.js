import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Share } from "react-native";

export default function ReferralCode({ navigation }) {

    const shareReferral = async () => {
        try {
            await Share.share({
                message: "Hey! Use my referral code: FITG1639 to join the Fitness Gym App!!",
            });
        } catch (error) {
            console.log(error);
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

            <Text style={styles.welcomeText}>Hi, Mitesh!</Text>
            {/* <Text style={styles.subtitle}>Welcome back to motivated Fitness GYM</Text> */}

            <View style={styles.planCard}>
                <View style={{ width: "50%" }}>
                    <Text style={styles.planLabel}>My Referral Code</Text>
                    <Text style={styles.planValue}>FITG1639</Text>
                </View>

            </View>


            <TouchableOpacity style={{ width: '100%' }} onPress={shareReferral}>
                <LinearGradient
                    colors={['#0081d1', '#1bc97b']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.buyBtn}
                >
                    <Text style={styles.buyBtnText}>SHARE</Text>
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
        marginBottom: 10,
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
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#2f4cf4ff',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
    },
    planLabel: {
        color: '#aaa',
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
    },
    planValue: {
        color: '#285ae3ff',
        fontSize: 20,
        fontWeight: 'bold',
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
