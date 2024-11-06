import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import ProductListingScreen from "../screens/ProductListingScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import CheckoutScreen from "../screens/CheckOutScreen";
import FilterScreen from "../screens/FilterScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";
import VerificationWaitingScreen from "../screens/VerificationWaitingScreen";
import PhoneSignUpScreen from "../screens/PhoneSignUpScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import UpdateProfileScreen from "../screens/UpdateProfileScreen";
import AccountScreen from "../screens/AccountScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductListing" component={ProductListingScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Filter" component={FilterScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen
          name="VerificationWaiting"
          component={VerificationWaitingScreen}
        />
        <Stack.Screen name="PhoneSignUp" component={PhoneSignUpScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
