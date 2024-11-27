import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CheckOutScreen';
import ProductListingScreen from '../screens/ProductListingScreen';
import AccountScreen from '../screens/AccountScreen';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { app } from '../firebase/firebaseConfig';

const Tab = createBottomTabNavigator();

const handleTabPress = (route, isFocused, navigation) => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  // Nếu user chưa đăng nhập và muốn vào thì chuyển về welcome screen
  // if (route.name === 'Account' && !user) {
  //   navigation.navigate('Welcome', { returnTo: { screen: 'Account' } });
  // } else if (!isFocused) {
  //   // Nếu user đã đăng nhập hoặc không phải vào account thì chuyển screen
  //   navigation.navigate(route.name);
  // }
  if (!isFocused) {
    navigation.navigate(route.name);
  }
};

function MyTabBar({ state, descriptors, navigation }:any) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            handleTabPress(route, isFocused, navigation);
          }
        };

        let iconName;
        if (route.name === 'Home') {
          iconName = 'home-outline';
        } else if (route.name === 'List') {
          iconName = 'bag-outline';
        } else if (route.name === 'Wishlist') {
          iconName = 'heart-outline';
        // } else if (route.name === 'Messages') {
        //   iconName = 'chatbubble-outline';
        } else if (route.name === 'Account') {
          iconName = 'person-outline';
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
          >
            <View style={[styles.iconContainer, isFocused && styles.focusedIconContainer]}>
              <Ionicons name={iconName} size={24} color={isFocused ? '#202028' : '#FFFFFF'} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="List" component={ProductListingScreen} 
      initialParams={{ category: null }}
      />
      <Tab.Screen name="Wishlist" component={CartScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(32, 32, 40, 0.3)',
    borderRadius: 40,
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusedIconContainer: {
    backgroundColor: '#FFFFFF',
    
  },
});

export default BottomTabNavigator;