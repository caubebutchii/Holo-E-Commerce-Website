import React, { useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';

const { width: screenWidth } = Dimensions.get('window');
const FeaturedBanner = ({ products, onPressProduct }: any) => {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => onPressProduct(item)} style={styles.container}>
      <ImageBackground source={{ uri: item.image }} style={styles.banner} resizeMode='cover'>
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.discount}>{item.discount}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Show Now</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        loop
        width={screenWidth - 32}
        height={200}
        autoPlay={true}
        data={products}
        scrollAnimationDuration={1000}
        // onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: 200,
    paddingHorizontal: 16,
    overflow: 'hidden',
    borderRadius: 12,
    marginTop:10

  },
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
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
    backgroundColor: '#30C084',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
  },
});

export default FeaturedBanner;