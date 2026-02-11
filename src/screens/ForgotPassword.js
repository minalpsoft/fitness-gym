import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const MY_API = process.env.EXPO_PUBLIC_MY_API;

export default function ForgotPassword({ navigation, route }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // const API_BASE_URL = "http://10.74.161.185:3000/";

    const handleResetPassword = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            const cleanEmail = email.trim().toLowerCase();

            const res = await fetch(`${MY_API}auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: cleanEmail,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                Alert.alert("Error", data.message || "Failed to reset password");
                return;
            }

            Alert.alert("Success", "Password updated successfully");
            navigation.navigate("LoginScreen");

        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Something went wrong");
        }
    };



    return (
        <ScrollView contentContainerStyle={styles.container}>


            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/gym_logo.jpg')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.title}>Update Profile</Text>

            <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="green" />
                <TextInput
                    placeholder="Enter Email"
                    placeholderTextColor="#aaa"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="green" />

                <TextInput
                    placeholder="Enter New Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={22}
                        color="#aaa"
                    />
                </TouchableOpacity>
            </View>


            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="green" />

                <TextInput
                    placeholder="Confirm New Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showConfirmPassword}
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                        size={22}
                        color="#aaa"
                    />
                </TouchableOpacity>
            </View>


            <TouchableOpacity style={{ width: "100%" }} onPress={handleResetPassword}>
                <LinearGradient
                    colors={['#0081d1ff', '#1bc97bff']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.submitBtn}
                >
                    <Text style={styles.submitText} >RESET PASSWORD</Text>
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
    logoContainer: {
        marginTop: 50,
        marginBottom: 20,
    },
    logo: {
        height: 200,
        width: 200
    },
    eyeIcon: {
        padding: 6,
    },
    title: {
        fontSize: 28,
        color: '#20e880ff',
        fontWeight: 'bold',
        marginTop: 30,
        alignSelf: "flex-start",
        marginLeft: 10,
        fontFamily: 'Poppins_400Regular',
        marginBottom: 20
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1c1f2e",
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 20,
    },

    input: {
        flex: 1,
        color: "#fff",
        paddingVertical: 12,
        paddingLeft: 10,
    },

    submitBtn: {
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 100
    },

    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
