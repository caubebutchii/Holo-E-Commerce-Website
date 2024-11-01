import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title, onBackPress, showCart }: any) => {
  const navigation = useNavigation();
  return (
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
          <Ionicons name="cart-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 8,
  },
  cartButton: {
    padding: 8,
  },
});

export default Header;