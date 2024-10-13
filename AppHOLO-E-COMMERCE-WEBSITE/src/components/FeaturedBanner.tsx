import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';

const FeaturedBanner = ({ product, onPress }:any) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ImageBackground source={{ uri: product.image }} style={styles.banner}>
        <View style={styles.overlay}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.discount}>{product.discount}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Buy now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    height: 200,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  discount: {
    fontSize: 18,
    color: 'white',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FeaturedBanner;