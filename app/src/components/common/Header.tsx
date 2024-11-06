import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const Header = ({ title, onBackPress, showCart }: any) => {
  const navigation = useNavigation();
  return (
    <LinearGradient
    colors={['#8B4513', '#8B4513']}
    style={styles.gradient}
  >
    <View style={styles.container}>
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {showCart && (
        <TouchableOpacity style={styles.cartButton}
          onPress={()=>navigation.navigate('Checkout')}
        >
          <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingTop: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  cartButton: {
    padding: 8,
  },
});

export default Header;