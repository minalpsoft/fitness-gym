import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from "expo-image-manipulator";




export default function SignUpScreen({ navigation }) {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [employeePhotoBase64, setEmployeePhotoBase64] = useState("");
    const [isFaceCaptured, setIsFaceCaptured] = useState(false);



    const onChange = (event, selectedDate) => {
        setShowPicker(false);
        if (selectedDate) {
            let d = selectedDate;
            let final = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            setDob(final);
        }
    };

    const getAllUsers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}getUser?apiToken=8d6bea78-a7ad-4eee-bcf7-03724af319fc&cusId=389`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            console.log("Fetched users:", data);
            return (data.data && data.data.rows) || [];
        } catch (err) {
            console.log("Error fetching users:", err);
            return [];
        }
    };


    let lastGeneratedId = null;

    const getNextIncrementalId = async () => {
        if (lastGeneratedId !== null) {
            lastGeneratedId += 1;
            return lastGeneratedId;
        }

        const users = await getAllUsers();
        console.log("Fetched users:", users);

        const filteredUsers = users.filter(u => parseInt(u.enrollId) < 1000);
        const maxId = filteredUsers.length
            ? Math.max(...filteredUsers.map(u => parseInt(u.enrollId)))
            : 0;

        lastGeneratedId = maxId + 1;
        return lastGeneratedId;
    };



    const BASE64_LIMIT = 300 * 1024;

    const openCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission Needed", "Camera permission is required");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            base64: false,
            quality: 0.8,
        });

        if (result.canceled) return;

        const asset = result.assets[0];
        let width = 700;
        let finalBase64 = null;

        for (let i = 0; i < 6; i++) {

            const manipulated = await ImageManipulator.manipulateAsync(
                asset.uri,
                [{ resize: { width } }],
                {
                    compress: 0.4,
                    format: ImageManipulator.SaveFormat.JPEG,
                    base64: true
                }
            );

            let clean = manipulated.base64
                .replace(/^data:image\/[a-zA-Z]+;base64,/, "")
                .replace(/[^0-9A-Za-z+/=]/g, "")  
                .replace(/(\r\n|\n|\r)/gm, "")
                .trim();

            const base64Bytes = clean.length * 0.75;
            const kb = base64Bytes / 1024;

            console.log(`Try ${i + 1}: width=${width}px | Size=${kb.toFixed(2)} KB`);

            finalBase64 = clean;

            if (base64Bytes <= BASE64_LIMIT) break;
            width -= 100;
        }

        setEmployeePhotoBase64(finalBase64);
        setIsFaceCaptured(true);

        Alert.alert("Success", "Photo captured successfully!");
    };


    const handleSignUp = async () => {
        if (!employeePhotoBase64) {
            Alert.alert("Missing Face ID", "Please register your Face Image first");
            return;
        }

        console.log("Final base64 length:", employeePhotoBase64.length);
        console.log("Starts with:", employeePhotoBase64.substring(0, 20));
        console.log("Ends with:", employeePhotoBase64.slice(-20));


        const uniqueId = await getNextIncrementalId();

        const payload = {
            apiToken: "8d6bea78-a7ad-4eee-bcf7-03724af319fc",
            cusId: 389,
            departmentId: 836,
            enrollId: Number(uniqueId),
            staffNumber: String(uniqueId),
            name,
            mobile,
            email,
            password,
            photoBase64: employeePhotoBase64,
            base64format: "jpg"
        };

        console.log("Payload being sent:", payload);

        try {
            const res = await fetch(`${API_BASE_URL}addUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            console.log("Response:", data);

            if (data.errCode !== 0) {
                Alert.alert("Error", data.msg || "Signup failed");
                return;
            }

            Alert.alert("Success", "Account created successfully");
            navigation.navigate("LoginScreen", { refreshUsers: true });

        } catch (err) {
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

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Motivated Fitness community</Text>

            <View style={styles.inputWrapper}>
                <Ionicons name="person" size={20} style={styles.icon} />
                <TextInput placeholder="Full Name" placeholderTextColor="#aaa" style={styles.input} value={name} onChangeText={setName} />
            </View>

            <View style={styles.inputWrapper}>
                <Ionicons name="call" size={20} style={styles.icon} />
                <TextInput placeholder="Mobile Number" placeholderTextColor="#aaa" style={styles.input} keyboardType="phone-pad" value={mobile} onChangeText={setMobile} />
            </View>

            <View style={styles.inputWrapper}>
                <Ionicons name="mail" size={20} style={styles.icon} />
                <TextInput placeholder="Email Address" placeholderTextColor="#aaa" style={styles.input} keyboardType="email-address" value={email} onChangeText={setEmail} />
            </View>

            <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
                <TextInput placeholder="Password" placeholderTextColor="#aaa" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
            </View>

            <View style={styles.inputWrapper}>
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
            </View>

            {/* <TouchableOpacity style={styles.faceBox} onPress={openCamera}>
                <Ionicons name="happy-outline" size={32} color="#00e676" />
                <View>
                    <Text style={styles.faceTitle}>Register Face ID</Text>
                    <Text style={styles.faceSubtitle}>Use your face to access gym securely</Text>
                </View>
            </TouchableOpacity> */}


            <TouchableOpacity style={styles.faceBox}
                onPress={openCamera}
            >
                <Ionicons
                    name={isFaceCaptured ? "checkmark-circle-outline" : "happy-outline"}
                    size={32}
                    color={isFaceCaptured ? "#00e676" : "#00e676"}
                />

                <View>
                    <Text style={styles.faceTitle}>
                        {isFaceCaptured ? "Face ID Captured" : "Register Face ID"}
                    </Text>

                    <Text style={styles.faceSubtitle}>
                        {isFaceCaptured
                            ? "Your face has been stored successfully"
                            : "Use your face to access gym securely"}
                    </Text>
                </View>
            </TouchableOpacity>



            <TouchableOpacity style={{ width: "100%" }}
                // onPress={() => navigation.navigate('LoginScreen')} 
                onPress={handleSignUp}
            >
                <LinearGradient
                    colors={['#0081d1ff', '#1bc97bff']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.submitBtn}
                >
                    <Text style={styles.submitText} >SUBMIT</Text>
                </LinearGradient>

            </TouchableOpacity>


            <Text style={styles.loginText}>Already have account? <Text style={styles.loginLink} onPress={() => navigation.navigate('LoginScreen')}> Login</Text></Text>
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
        fontFamily: 'Poppins_400Regular'
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
    },
    submitText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins_400Regular'
    },
    loginText: {
        marginTop: 20,
        color: '#aaa',
        fontFamily: 'Poppins_400Regular',
        marginBottom: 50
    },
    loginLink: {
        color: '#1691c2ff',
        fontWeight: '600',
        fontFamily: 'Poppins_400Regular'
    },
    previewContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 5,
        alignItems: "center"
    },
    previewTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10
    },
    previewImage: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 3,
        borderColor: "#00e676",
        marginBottom: 15
    },
    previewButtons: {
        flexDirection: "row",
        gap: 10,
    },
    retakeButton: {
        backgroundColor: "#ff5252",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8
    },
    retakeText: { color: "#fff", fontWeight: "bold" },
    useButton: {
        backgroundColor: "#00e676",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8
    },
    useText: { color: "#fff", fontWeight: "bold" }

});
