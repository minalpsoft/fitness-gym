import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Platform } from "react-native";
import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
// const MY_API = Constants.expoConfig.extra.MY_API;
const MY_API = "http://10.74.161.185:3000/";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UpdateProfile({ navigation, route }) {
    const [fullName, setFullName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [dob, setDob] = useState('');
    // const [showPicker, setShowPicker] = useState(false);

    const [clientUserId, setClientUserId] = useState(null);

    useEffect(() => {
        const loadUserId = async () => {
            const id = await AsyncStorage.getItem("clientUserId");
            if (id) {
                setClientUserId(Number(id));
            } else {
                Alert.alert("Error", "Client User ID missing");
            }
        };

        loadUserId();
    }, []);


    // to show prefilled values
    useEffect(() => {
        if (!clientUserId) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${MY_API}auth/user/${clientUserId}`);

                const data = await res.json();

                console.log("PROFILE DATA:", data);

                if (data?.errCode === 0 && data?.data) {
                    setFullName(data.data.name || '');
                    setEmail(data.data.email || '');
                    setMobile(data.data.mobile || '');
                } else {
                    Alert.alert("Error", "Failed to load profile");
                }
            } catch (err) {
                console.error("FETCH PROFILE ERROR:", err);
                Alert.alert("Error", "Unable to fetch profile");
            }
        };

        fetchProfile();
    }, [clientUserId]);


    // const onChange = (event, selectedDate) => {
    //     setShowPicker(false);
    //     if (selectedDate) {
    //         let d = selectedDate;
    //         let final = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    //         setDob(final);
    //     }
    // };


    const handleUpdateProfile = async () => {
        if (!clientUserId) {
            Alert.alert("Error", "Client User ID missing");
            return;
        }

        console.log("UPDATE BUTTON CLICKED");

        const clientPayload = {
            apiToken: "8d6bea78-a7ad-4eee-bcf7-03724af319fc",
            cusId: 389,
            departmentId: 836,
            enrollId: clientUserId,
            name: fullName,
            mobile,
            email,
            // password
        };

        try {
            const res = await fetch(`${API_BASE_URL}updateUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(clientPayload)
            });

            const data = await res.json();
            console.log("CLIENT UPDATE RESPONSE:", data);

            if (data.errCode !== 0) {
                Alert.alert("Error", data.msg || "Client update failed");
                return;
            }

            const myRes = await fetch(`${MY_API}auth/update-user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientUserId,
                    name: fullName,
                    email,
                    mobile,
                    // password
                })
            });

            console.log("LOGIN UPDATE STATUS:", myRes.status);

            if (!myRes.ok) {
                Alert.alert("Warning", "Client updated, login update failed");
                return;
            }

            Alert.alert("Success", "Profile updated successfully");
            navigation.navigate("Dashboard");

        } catch (err) {
            console.error("UPDATE ERROR:", err);
            Alert.alert("Error", "Something went wrong");
        }
    };

    useEffect(() => {
        if (!clientUserId) {
            console.warn("clientUserId missing in UpdateProfile screen");
        }
    }, []);


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

            <Text style={styles.title}>Update Profile</Text>
            {/* <Text style={styles.subtitle}>Join the Motivated Fitness community</Text> */}

            <View style={styles.inputWrapper}>
                <Ionicons name="person" size={20} style={styles.icon} />
                <TextInput placeholder="Full Name" placeholderTextColor="#aaa" style={styles.input} value={fullName} onChangeText={setFullName} />
            </View>

            <View style={styles.inputWrapper}>
                <Ionicons name="call" size={20} style={styles.icon} />
                <TextInput placeholder="Mobile Number" placeholderTextColor="#aaa" style={styles.input} keyboardType="phone-pad" value={mobile} onChangeText={setMobile} />
            </View>

            <View style={styles.inputWrapper}>
                <Ionicons name="mail" size={20} style={styles.icon} />
                <TextInput placeholder="Email Address" placeholderTextColor="#aaa" style={styles.input} keyboardType="email-address" value={email} onChangeText={setEmail} />
            </View>

            {/* <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
                <TextInput placeholder="Password" placeholderTextColor="#aaa" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
            </View> */}

            {/* <View style={styles.inputWrapper}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowPicker(true)}>
                    <TextInput
                        placeholder="Date of birth"
                        placeholderTextColor="#aaa"
                        value={dob}
                        editable={false}
                        style={styles.input}
                    />
                </TouchableOpacity>

                <Ionicons
                    name="calendar-outline"
                    size={20}
                    style={styles.icon}
                    onPress={() => setShowPicker(true)}
                />

                {showPicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={onChange}
                    />
                )}
            </View> */}

            <TouchableOpacity style={{ width: "100%" }} onPress={handleUpdateProfile}>
                <LinearGradient
                    colors={['#0081d1ff', '#1bc97bff']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.submitBtn}
                >
                    <Text style={styles.submitText} >UPDATE</Text>
                </LinearGradient>

            </TouchableOpacity>

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
        height: 200,
        width: 200
    },
    title: {
        fontSize: 28,
        color: '#20e880ff',
        fontWeight: 'bold',
        marginTop: 10,
        alignSelf: "flex-start",
        marginLeft: 10,
        fontFamily: 'Poppins_400Regular',
        marginBottom: 20
    },
    subtitle: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 20,
        alignSelf: "flex-start",
        marginLeft: 10,
        fontFamily: 'Poppins_400Regular'

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
    faceBox: {
        borderWidth: 1,
        borderColor: '#00e676',
        borderStyle: 'dashed',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        width: '100%',
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 15,
        gap: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    faceTitle: {
        color: '#00e676',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins_400Regular'
    },
    faceSubtitle: {
        color: '#aaa',
        fontSize: 12,
        fontFamily: 'Poppins_400Regular'
    },
    submitBtn: {
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 230
    },
    submitText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins_400Regular'
    },
});
