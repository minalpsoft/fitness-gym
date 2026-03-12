import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Dimensions, Modal, Button } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from "expo-image-manipulator";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const MY_API = process.env.EXPO_PUBLIC_MY_API;


export default function SignUpScreen({ navigation }) {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [dob, setDob] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [employeePhotoBase64, setEmployeePhotoBase64] = useState("");
    const [isFaceCaptured, setIsFaceCaptured] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [agreed, setAgreed] = useState(false);


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

    // const getNextIncrementalId = async () => {
    //     const users = await getAllUsers();

    //     if (!users.length) {
    //         return Date.now() % 100000;
    //     }

    //     const validIds = users
    //         .map(u => Number(u.enrollId))
    //         .filter(id => !isNaN(id));

    //     const maxId = Math.max(...validIds);
    //     return maxId + 1;
    // };

    const getNextIncrementalId = async () => {
        const response = await getAllUsers();

        const users = response?.data?.rows || [];

        if (!users.length) {
            return Date.now();
        }

        const validIds = users
            .map(u => Number(u.enrollId))
            .filter(id => !isNaN(id));

        const maxId = Math.max(...validIds);

        return maxId + 1;
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
        if (!agreed) {
            Alert.alert("Terms Not Accepted", "Please accept Terms and Conditions to proceed");
            return;
        }

        if (!employeePhotoBase64) {
            Alert.alert("Missing Face ID", "Please register your Face Image first");
            return;
        }

        // const uniqueId = await getNextIncrementalId();
        const uniqueId = Date.now();

        const clientPayload = {
            apiToken: "8d6bea78-a7ad-4eee-bcf7-03724af319fc",
            cusId: 389,
            departmentId: 836,
            enrollId: Number(uniqueId),
            staffNumber: String(uniqueId),
            name,
            mobile,
            email,
            password,
            photoBase64: employeePhotoBase64
        };

        try {
            const res = await fetch(`${API_BASE_URL}addUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(clientPayload)
            });

            let data = null;
            try {
                data = await res.json();
            } catch (e) {
                console.log("addUser response is not JSON");
            }

            console.log("ADD USER RESPONSE:", data);

            if (!res.ok || data?.errCode !== 0) {
                Alert.alert("Error", data?.msg || "Signup failed");
                return;
            }

            const importRes = await fetch(`${MY_API}auth/import-user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientUserId: uniqueId,
                    name,
                    email,
                    mobile,
                    password
                })
            });

            let importData = null;

            try {
                importData = await importRes.json();
            } catch (e) {
                console.log("Import response is not JSON");
            }

            console.log("Import result:", importData);

            if (!importRes.ok) {
                Alert.alert(
                    "Error",
                    importData?.message || "User import failed (backend error)"
                );
                return;
            }



            Alert.alert("Success", "Account created successfully");
            navigation.navigate("LoginScreen");

        } catch (err) {
            console.error("SIGNUP ERROR 👉", err);
            Alert.alert("Error", err.message || "Something went wrong");
        }

    };
    // console.log("API_BASE_URL 👉", API_BASE_URL);
    // console.log("MY_API 👉", MY_API);


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

            <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => setShowTermsModal(true)}
            >
                <Ionicons
                    name={agreed ? "checkbox-outline" : "square-outline"}
                    size={24}
                    color="#00e676"
                    onPress={() => setAgreed(!agreed)}
                />
                <Text style={styles.termsText}>I agree to the <Text style={{ color: "#1691c2" }}>Terms and Conditions</Text></Text>
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

            <Modal visible={showTermsModal} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTextTitle}>Terms and Conditions</Text>
                        <ScrollView style={{ marginVertical: 10 }}>
                            <Text style={styles.modalText}>
                                LIABILITY WAIVER, ASSUMPTION OF RISK, AND UNCONDITIONAL RELEASE AGREEMENT
                                FITCON LTD TRADING AS MOTIVATED FITNESS GYM
                            </Text>

                            <Text style={styles.modalText}>
                                IMPORTANT LEGAL NOTICE: READ THIS DOCUMENT CAREFULLY BEFORE SIGNING.
                                THIS IS A LEGALLY BINDING CONTRACT THAT AFFECTS YOUR LEGAL RIGHTS.
                            </Text>

                            <Text style={styles.modalText}>
                                This Liability Waiver, Assumption of Risk, and Unconditional Release Agreement
                                (hereinafter "the Agreement") constitutes a binding legal contract whereby you,
                                the undersigned Member or Guest, voluntarily and irrevocably relinquish certain legal
                                rights, including the right to sue or claim compensation for injuries, losses, or
                                damages arising from your use of the fitness facilities operated by FitCon Ltd trading
                                as Motivated Fitness Gym.
                            </Text>

                            <Text style={styles.modalText}>
                                By executing this Agreement, you acknowledge that you are waiving substantial legal
                                rights and accepting full personal responsibility for all risks associated with your
                                participation in fitness activities and use of the premises and facilities.
                            </Text>

                            <Text style={styles.modalText}>
                                IF YOU DO NOT UNDERSTAND ANY PROVISION OF THIS AGREEMENT, YOU SHOULD SEEK INDEPENDENT
                                LEGAL ADVICE BEFORE SIGNING.
                            </Text>

                            <ScrollView style={{ marginVertical: 10 }}>
                                <Text style={styles.modalTextTitle}>1. DEFINITIONS AND INTERPRETATION</Text>

                                <Text style={styles.modalText}>
                                    1.1 In this Agreement, unless the context otherwise requires, the following terms shall have the meanings ascribed to them:
                                </Text>

                                <Text style={styles.modalText}>
                                    "Activities" means any and all physical exercise, fitness training, sporting activities, recreational pursuits, classes, programmes, instruction, personal training, use of exercise equipment or facilities, and any other activity whatsoever undertaken on or in connection with the Premises, whether supervised or unsupervised, and whether occurring during Staffed Hours or Unstaffed Hours.
                                </Text>

                                <Text style={styles.modalText}>
                                    "Agreement" means this Liability Waiver, Assumption of Risk, and Unconditional Release Agreement, including all schedules, appendices, and amendments thereto.
                                </Text>

                                <Text style={styles.modalText}>
                                    "CCTV" means closed-circuit television surveillance systems installed on the Premises for security purposes only, which do not create any duty of care, supervision, or monitoring obligation on the part of the Company.
                                </Text>

                                <Text style={styles.modalText}>
                                    "Company" or "Gym" means FitCon Ltd, a limited company incorporated and registered in Ireland, trading as Motivated Fitness Gym, Cork, and includes its directors, officers, shareholders, employees, agents, contractors, affiliates, successors, and assigns.
                                </Text>

                                <Text style={styles.modalText}>
                                    "Equipment" means all exercise apparatus, machines, weights, free weights, resistance equipment, cardiovascular equipment, accessories, mats, benches, racks, fitness tools, sports equipment, and any other items or apparatus provided by or available at the Premises for use in connection with the Activities.
                                </Text>

                                <Text style={styles.modalText}>
                                    "Facilities" means all areas, rooms, zones, and amenities within or associated with the Premises, including but not limited to gymnasiums, workout areas, cardio zones, free weights areas, functional training areas, changing rooms, locker rooms, showers, toilets, reception areas, corridors, stairways, elevators, car parks, entrance and exit points, and all other spaces.
                                </Text>

                                <Text style={styles.modalText}>
                                    "Member" or "Guest" or "Participant" or "You" means the individual executing this Agreement, whether as a paying member, guest, visitor, trial user, or any other person entering or using the Premises or Facilities for any purpose.
                                </Text>

                                <Text style={styles.modalText}>
                                    "Premises" means the building, land, car park, and all associated property located at Motivated Fitness Gym, Cork, and operated by the Company.
                                </Text>

                                <Text style={styles.modalText}>
                                    "Released Parties" means collectively the Company and its past, present, and future directors, officers, shareholders, members, employees, agents, contractors, service providers, insurers, affiliates, parent companies, subsidiary companies, related entities, successors, assigns, and representatives.
                                </Text>

                                <Text style={styles.modalText}>
                                    "Staffed Hours" means those periods during which the Company has designated personnel present on the Premises.
                                </Text>

                                <Text style={styles.modalText}>
                                    "Unstaffed Hours" means those periods during which the Premises are accessible to Members but no Company personnel are present on site.
                                </Text>

                                <Text style={styles.modalText}>
                                    1.2 References to statutory provisions shall include those provisions as amended, re-enacted, or replaced from time to time, and shall include any subordinate legislation made under such provisions.
                                </Text>

                                <Text style={styles.modalText}>
                                    1.3 Headings are for convenience only and do not affect the interpretation of this Agreement.
                                </Text>

                                <Text style={styles.modalText}>
                                    1.4 Words importing the singular include the plural and vice versa; words importing any gender include all genders.
                                </Text>

                                <Text style={styles.modalTextTitle}>2. ACKNOWLEDGEMENT OF DANGEROUS NATURE OF ACTIVITIES</Text>
                                <Text style={styles.modalText}>
                                    2.1 You expressly acknowledge, understand, and agree that physical exercise, fitness training, weightlifting, cardiovascular exercise, use of exercise equipment, and all other Activities are inherently dangerous and carry substantial and significant risks of serious bodily injury, permanent disability, paralysis, and death.
                                </Text>
                                <Text style={styles.modalText}>
                                    2.2 You specifically acknowledge that the risks associated with the Activities include, but are not limited to:
                                </Text>
                                <Text style={styles.modalText}>
                                    (a) Cardiovascular events including heart attack, stroke, cardiac arrest, or other cardiopulmonary complications, which may result in death;
                                    {"\n"}(b) Musculoskeletal injuries including strains, sprains, tears, ruptures, fractures, dislocations, hernias, and other injuries to muscles, tendons, ligaments, bones, joints, and connective tissues;
                                    {"\n"}(c) Head, neck, and spinal injuries including concussion, traumatic brain injury, spinal cord damage, paralysis, and permanent neurological impairment;
                                    {"\n"}(d) Crushing injuries, impact injuries, and trauma from dropped weights or falling equipment;
                                    {"\n"}(e) Lacerations, contusions, abrasions, and other soft tissue damage;
                                    {"\n"}(f) Exacerbation of pre-existing medical conditions, whether known or unknown to you;
                                    {"\n"}(g) Heat exhaustion, heat stroke, dehydration, and related thermoregulatory disorders;
                                    {"\n"}(h) Slips, trips, and falls on wet surfaces, uneven surfaces, stairs, or other areas of the Premises;
                                    {"\n"}(i) Collisions with equipment, walls, doors, other persons, or fixed objects;
                                    {"\n"}(j) Equipment malfunction, equipment failure, breaking or collapse of equipment, and defects in equipment whether latent or apparent;
                                    {"\n"}(k) Injuries arising from improper use of equipment, poor exercise technique, overexertion, or exceeding personal physical capabilities;
                                    {"\n"}(l) Injuries caused by the negligent or reckless conduct of other Members, Guests, or third parties present on the Premises;
                                    {"\n"}(m) Injuries occurring in changing rooms, locker rooms, showers, toilets, stairways, car parks, and all other areas of the Facilities;
                                    {"\n"}(n) Theft, loss, or damage to personal property including vehicles, clothing, valuables, and electronic devices;
                                    {"\n"}(o) Psychological or emotional distress resulting from injury, accident, or incident;
                                    {"\n"}(p) Any other injury, illness, damage, loss, or harm whatsoever, whether foreseeable or unforeseeable, arising directly or indirectly from your presence on the Premises or participation in the Activities.
                                </Text>
                                <Text style={styles.modalText}>
                                    2.3 You acknowledge that the foregoing list of risks is not exhaustive and that other risks, both known and unknown, anticipated and unanticipated, may also result in injury, illness, death, or property damage.
                                </Text>
                                <Text style={styles.modalText}>
                                    2.4 You confirm that you have been provided with adequate opportunity to inspect the Premises, Equipment, and Facilities, and that you are satisfied with their condition for your intended use.
                                </Text>

                                {/* Section 3 */}
                                <Text style={styles.modalTextTitle}>3. VOLUNTARY ASSUMPTION OF ALL RISKS</Text>
                                <Text style={styles.modalText}>
                                    3.1 You hereby expressly, voluntarily, knowingly, and unconditionally assume full and complete responsibility for all risks associated with your entry upon the Premises, your use of the Facilities and Equipment, and your participation in any and all Activities, whether occurring during Staffed Hours or Unstaffed Hours.
                                </Text>
                                <Text style={styles.modalText}>
                                    3.2 Your assumption of risk includes, without limitation:
                                    {"\n"}(a) Risks arising from your own acts, omissions, negligence, or failure to follow instructions, rules, or safety guidelines;
                                    {"\n"}(b) Risks arising from the acts, omissions, or negligence of the Released Parties, whether active or passive, including negligent instruction, negligent supervision, negligent hiring or retention of employees, negligent maintenance of Equipment or Facilities, negligent design or layout of the Premises, or any other form of negligence;
                                    {"\n"}(c) Risks arising from the acts, omissions, or negligence of other Members, Guests, or third parties;
                                    {"\n"}(d) Risks arising from defects in Equipment or Facilities, whether latent or apparent;
                                    {"\n"}(e) Risks arising from your use of the Premises during Unstaffed Hours when no Company personnel are present and no supervision, assistance, or emergency response is available;
                                    {"\n"}(f) Risks arising from any pre-existing medical condition, injury, illness, or physical limitation, whether known or unknown to you;
                                    {"\n"}(g) Risks arising from your failure to obtain appropriate medical clearance, physical examination, or professional advice prior to engaging in the Activities;
                                    {"\n"}(h) All other risks inherent in or associated with the Activities and use of the Premises, whether or not specifically identified in this Agreement.
                                </Text>
                                <Text style={styles.modalText}>
                                    3.3 You acknowledge and agree that you are engaging in the Activities entirely at your own risk and that the Company does not and cannot guarantee your safety.
                                </Text>
                                <Text style={styles.modalText}>
                                    3.4 You confirm that your decision to participate in the Activities and use the Facilities is entirely voluntary and that you have not been coerced, pressured, or induced to enter into this Agreement.
                                </Text>

                                {/* Section 4 */}
                                <Text style={styles.modalTextTitle}>4. MEDICAL AFFIRMATION AND PERSONAL RESPONSIBILITY</Text>
                                <Text style={styles.modalText}>
                                    4.1 You represent, warrant, and confirm that:
                                    {"\n"}(a) You do not suffer from any medical condition, illness, injury, or physical limitation that would make your participation in the Activities dangerous, inadvisable, or contraindicated;
                                    {"\n"}(b) You have either obtained a medical examination from a qualified physician and received express permission to engage in strenuous physical exercise and use fitness facilities; or knowingly and voluntarily chosen to participate without medical clearance, in which case you accept full responsibility;
                                    {"\n"}(c) You do not pose a significant risk to your own health or to the health and safety of others;
                                    {"\n"}(d) You are physically and mentally capable of safely engaging in the Activities;
                                    {"\n"}(e) You will limit your participation to levels appropriate to your fitness and capabilities;
                                    {"\n"}(f) You will immediately cease participation and seek medical attention if you experience symptoms of distress or injury.
                                </Text>
                            </ScrollView>

                            {/* </Text> */}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setShowTermsModal(false)} style={{ width: '100%' }}>
                            <LinearGradient
                                colors={['#0081d1ff', '#1bc97bff']}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={{
                                    padding: 10,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    marginTop: 10
                                }}
                            >
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Close</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    termsContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 15, gap: 8 },
    termsText: { color: '#aaa', fontSize: 14 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    modalContent: {
        width: '90%',
        backgroundColor: '#1e1e1e', // dark background
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
        borderWidth: 1,             // add border
        borderColor: '#444',        // subtle lighter/darker border
        shadowColor: '#000',        // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,               // Android shadow
    },
    modalText: {
        color: '#fff', // make text visible on dark background
        fontSize: 14,
        lineHeight: 20,
    },

    modalTextTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
    },
    loginText: {
        marginTop: 20,
        color: '#aaa',
        fontFamily: 'Poppins_400Regular',
        marginBottom: 250
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
