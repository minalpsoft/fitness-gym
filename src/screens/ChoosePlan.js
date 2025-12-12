import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChoosePlan({ navigation }) {
    const [selectedPlan, setSelectedPlan] = useState('1 Month');

    const plans = [
        { label: '1 Day', duration: 'End Same Day', price: 49 },
        { label: '1 Week', duration: '7 Day', price: 49 },
        { label: '2 Weeks', duration: '14 Day', price: 49 },
        { label: '1 Month', duration: '30 Day', price: 49 },
        { label: '6 Months', duration: '180 Day', price: 49 },
        { label: '12 Months', duration: '365 Day', price: 49 },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.backContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
                    <Ionicons name="arrow-back-outline" size={28} color="#20e880ff" />
                </TouchableOpacity>
            </View>

            <Image
                source={require('../../assets/gym_logo.jpg')}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>Choose your plan</Text>
            <Text style={styles.subtitle}>Select your membership duration</Text>

            {plans.map((plan) => (
                <TouchableOpacity
                    key={plan.label}
                    style={[
                        styles.planCard,
                        selectedPlan === plan.label && styles.selectedPlanCard
                    ]}
                    onPress={() => setSelectedPlan(plan.label)}
                >
                    <View>
                        <Text style={styles.planLabel}>{plan.label}</Text>
                        <Text style={styles.planDuration}>{plan.duration}</Text>
                    </View>
                    <Text style={styles.planPrice}>Rs.{plan.price}</Text>
                </TouchableOpacity>
            ))}

            <View
                style={styles.selectedPlan}
            >
                <Text style={styles.selectedText}>Selected Plan : {selectedPlan}</Text>
                <Text style={styles.selectedText}>Rs.49</Text>
            </View>

            <View style={{ width: "100%", alignItems: "flex-start" }}>
                <Text style={styles.expireText}>Expire On 30 Nov 2025</Text>
            </View>


            <TouchableOpacity style={{ width: "100%" }} onPress={() => navigation.navigate('Payment')}>
                <LinearGradient
                    colors={['#0081d1ff', '#1bc97bff']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.submitBtn}
                >
                    <Text style={styles.submitText}>NEXT</Text>
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#000',
        padding: 20,
        alignItems: 'center',
    },
    backContainer: {
         width: '100%',
        paddingVertical: 10,
        alignItems: 'flex-start',
        // marginBottom: 10,
    },
    logo: {
        height: 150,
        width: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        color: '#20e880ff',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: 10,
        fontFamily: 'Poppins_400Regular',
    },
    subtitle: {
        color: '#aaa',
        fontSize: 14,
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginBottom: 10,
        fontFamily: 'Poppins_400Regular',
    },
    planCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#111',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#2f4cf4ff',
        padding: 15,
        marginBottom: 10,
        width: '100%',
    },
    selectedPlanCard: {
        borderColor: '#20e880ff',
        borderWidth: 2,
    },
    planLabel: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',

    },
    planDuration: {
        color: '#aaa',
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',

    },
    planPrice: {
        color: '#ffffffff',
        fontSize: 16,
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

    submitBtn: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom:50
    },
    submitText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins_400Regular',

    },
});
