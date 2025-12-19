import React from 'react';
import { View, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
import PaypalPayment1 from './src/screens/PaypalPayment1';


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

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0affc2" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator initialRouteName="SignUpScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="ChoosePlan" component={ChoosePlan} />
        <Stack.Screen name="MakePayment" component={MakePayment} />
        <Stack.Screen name="PaypalPayment" component={PaypalPayment} />
        <Stack.Screen name="PaypalPayment1" component={PaypalPayment1} />

        <Stack.Screen name="BuyPlan" component={BuyPlan} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
        <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
        <Stack.Screen name="ReferralCode" component={ReferralCode} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
