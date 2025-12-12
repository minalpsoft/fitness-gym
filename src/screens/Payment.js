import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Payment({ navigation }) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.backContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('ChoosePlan')}>
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

            <View
                style={styles.selectedPlan}
            >
                <Text style={styles.selectedText}>Selected Plan : 1 Month</Text>
                <Text style={styles.selectedText}>Rs.49</Text>
            </View>

            <View style={{ width: "100%", alignItems: "flex-start" }}>
                <Text style={styles.expireText}>Expire On 30 Nov 2025</Text>
            </View>


            <View style={styles.planCard}>
                <Ionicons name="pricetag" size={18} color="green" />

                <View style={{ flex: 1 }}>
                    <TextInput
                        style={styles.couponInput}
                        placeholder="Apply Coupon"
                        placeholderTextColor="#777"
                    />
                </View>
            </View>



            <TouchableOpacity style={{ width: '100%' }} onPress={() => navigation.navigate('BuyPlan')}>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        // marginVertical: 20,
        width: '100%',
    },
    selectedText: {
        color: '#20e880ff',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Poppins_400Regular',
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
});
