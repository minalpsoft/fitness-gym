import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Constants from "expo-constants";
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const API_BASE_URL = "http://10.74.161.185:3000/";

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Email and password required");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Login failed");
                return;
            }

            // ✅ Store userId for subscription & payment
            await AsyncStorage.setItem("userId", String(data.userId));

            navigation.replace("Dashboard");
        } catch (err) {
            alert("Something went wrong");
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.backContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
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

            <Text style={styles.title}>Welcome</Text>

            <View style={styles.inputWrapper}>
                <Ionicons name="mail" size={20} style={styles.icon} />
                <TextInput placeholder="Enter Email" placeholderTextColor="#aaa" style={styles.input} keyboardType="email-address" value={email} onChangeText={setEmail} />
            </View>

            <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
                <TextInput placeholder="Enter Password" placeholderTextColor="#aaa" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
            </View>

            <TouchableOpacity style={{ width: "100%" }}
                // onPress={() => navigation.navigate('Dashboard')}
                onPress={handleLogin}
            >
                <LinearGradient
                    colors={['#0081d1ff', '#1bc97bff']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.submitBtn}
                >
                    <Text style={styles.submitText}>LOGIN</Text>
                </LinearGradient>
            </TouchableOpacity>


            <Text style={styles.forgotText}>Forgot Password</Text>

            <Text style={styles.loginText}>Already have account? <Text style={styles.loginLink} onPress={() => navigation.navigate('SignUpScreen')}> Register</Text></Text>
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
        padding: 20,
        alignItems: 'center',
    },
    logoContainer: {
        marginTop: 30,
        marginBottom: 20,
    },
    logo: {
        height: 240,
        width: 240
    },
    title: {
        fontSize: 30,
        color: '#20e880ff',
        fontWeight: 'bold',
        marginTop: 10,
        alignSelf: "flex-start",
        marginLeft: 10,
        fontFamily: 'Poppins_400Regular',
        marginBottom: 20
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#2f4cf4ff',
        paddingHorizontal: 10,
        marginBottom: 15,
        width: '100%',
        height: 50,
    },
    icon: {
        marginRight: 8,
        color: "green"
    },
    input: {
        flex: 1,
        color: '#fff',
        paddingVertical: 12,
        paddingLeft: 5,
    },
    submitBtn: {
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    submitText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins_400Regular'
    },
    forgotText: {
        marginTop: 30,
        color: '#20e880ff',
        fontFamily: 'Poppins_400Regular',
    },
    loginText: {
        marginTop: 10,
        color: '#aaa',
        fontFamily: 'Poppins_400Regular',
        marginBottom: 50,
        marginBottom: 50

    },
    loginLink: {
        color: '#1691c2ff',
        fontWeight: '600',
        fontFamily: 'Poppins_400Regular'
    },
});
