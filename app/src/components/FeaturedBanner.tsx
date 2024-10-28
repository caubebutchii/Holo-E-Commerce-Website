import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FeaturedBanner = ({ product, onPress }: any) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ImageBackground source={{ uri: product.image }} style={styles.banner} resizeMode='cover'>
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.discount}>{product.discount}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  banner: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  discount: {
    fontSize: 18,
    color: '#FFD700',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FeaturedBanner;