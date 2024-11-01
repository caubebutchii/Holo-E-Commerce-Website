import  React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const DiscountedBanner = ({ item, onPress }: { item: any; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      >
        <View style={styles.discountContainer}>
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  discountContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DiscountedBanner;