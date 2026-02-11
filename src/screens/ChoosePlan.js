import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from "react-native";
// const API_URL = "http://10.74.161.185:3000/chooseplan";
const MY_API = process.env.EXPO_PUBLIC_MY_API;

export default function ChoosePlan({ navigation }) {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);


    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            // const res = await fetch(API_URL);
             const res = await fetch(`${MY_API}chooseplan`);
            const response = await res.json();

            if (response.errCode !== 0) {
                Alert.alert("Error", "Failed to load plans");
                return;
            }

            setPlans(response.data);
            setSelectedPlan(response.data[0]);
        } catch (err) {
            console.log(err);
            Alert.alert("Error", "Server not reachable");
        }
    };


    const calculateExpiryDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toDateString();
    };

    const handleNext = () => {
        if (!selectedPlan) {
            Alert.alert("Select Plan", "Please select a plan");
            return;
        }

        const payload = {
            planId: selectedPlan.id,
            planName: selectedPlan.label,
            price: selectedPlan.price,
            durationDays: selectedPlan.days,
            expiryDate: calculateExpiryDate(selectedPlan.days)
        };

        // console.log("Selected Plan Payload:", payload);
        navigation.navigate("MakePayment", payload);
    };

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
                    key={plan.id}
                    style={[
                        styles.planCard,
                        selectedPlan?.id === plan.id && styles.selectedPlanCard
                    ]}
                    onPress={() => setSelectedPlan(plan)}
                >
                    <View>
                        <Text style={styles.planLabel}>{plan.label}</Text>
                        <Text style={styles.planDuration}>{plan.days} Day</Text>
                    </View>
                    <Text style={styles.planPrice}>Rs.{plan.price}</Text>
                </TouchableOpacity>
            ))}

            {selectedPlan && (
                <>
                    <View style={styles.selectedPlan}>
                        <Text style={styles.selectedText}>
                            Selected Plan : {selectedPlan.label}
                        </Text>
                        <Text style={styles.selectedText}>
                            Rs.{selectedPlan.price}
                        </Text>
                    </View>

                    <View style={{ width: "100%", alignItems: "flex-start" }}>
                        <Text style={styles.expireText}>
                            Expire On: {calculateExpiryDate(selectedPlan.days)}
                        </Text>
                    </View>
                </>
            )}

            <TouchableOpacity style={{ width: "100%" }} onPress={handleNext}>
                <LinearGradient
                    colors={["#0081d1ff", "#1bc97bff"]}
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
        marginBottom: 50
    },
    submitText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins_400Regular',

    },
});
