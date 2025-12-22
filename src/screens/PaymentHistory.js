import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

                {/* Header Row */}
                <View style={styles.row}>
                    <Text style={styles.planLabel}>Date</Text>
                    <Text style={styles.planLabel}>Time</Text>
                    <Text style={styles.planLabel}>Amount</Text>
                </View>

                {/* Value Row */}
                <View style={styles.row}>
                    <Text style={styles.valueText}>30 Nov 2025</Text>
                    <Text style={styles.valueText}>10:30 AM</Text>
                    <Text style={styles.valueText}>₹ 1500</Text>
                </View>

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
