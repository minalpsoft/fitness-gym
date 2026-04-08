import React, { useEffect, useState } from 'react';
import { View, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import Dashboard from './src/screens/Dashboard';
import ChoosePlan from './src/screens/ChoosePlan';
import MakePayment from './src/screens/MakePayment';
import BuyPlan from './src/screens/BuyPlan';
import UpdateProfile from './src/screens/UpdateProfile';
import PaymentHistory from './src/screens/PaymentHistory';
import ReferralCode from './src/screens/ReferralCode';
import PaypalPayment from './src/screens/PaypalPayment';
import PaypalSandbox from './src/screens/PaypalSandbox';
import ForgotPassword from './src/screens/ForgotPassword';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("LoginScreen");

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const clientUserId = await AsyncStorage.getItem("clientUserId");

      if (clientUserId) {
        setInitialRoute("Dashboard");
      } else {
        setInitialRoute("LoginScreen");
      }
    } catch (error) {
      console.log("Error checking login status:", error);
      setInitialRoute("LoginScreen");
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#000',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator size="large" color="#0affc2" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="ChoosePlan" component={ChoosePlan} />
        <Stack.Screen name="MakePayment" component={MakePayment} />
        <Stack.Screen name="PaypalPayment" component={PaypalPayment} />
        <Stack.Screen name="PaypalSandbox" component={PaypalSandbox} />
        <Stack.Screen name="BuyPlan" component={BuyPlan} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
        <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
        <Stack.Screen name="ReferralCode" component={ReferralCode} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}