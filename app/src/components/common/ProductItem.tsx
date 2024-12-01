import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductItem = ({ product, onPress }: any) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode='cover' />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={10} color="#FFD700" />
          <Text style={styles.rating}>{product.rating}</Text>
        </View>
        <View style={styles.priceRatingContainer}>
          <View style = {styles.priceContainer}>
            <Text style={styles.d}>₫</Text>
            <Text style={styles.price}>
              {new Intl.NumberFormat('vi-VN').format(product.price)}
            </Text>
          </View>
          <Text style={styles.textPrice}>Đã bán 5,4k</Text>
          {/* <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={30} color="#007AFF" />
          </TouchableOpacity> */}
        </View>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    // alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
    width: '50%',
    flex: 1,
    marginRight: 10
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  infoContainer: {
    marginLeft: 5,
    marginBottom: 5
  },
  priceRatingContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  name: {
    fontSize: 14,
    color: '#333',
    marginVertical: 10
  },
  priceContainer:{
    flexDirection:'row'
  },
  price: {
    fontSize: 16,
    color: '#0dd7df',
    marginTop: 4,
    fontWeight: 'bold'
  },
  d:{
    fontSize: 10,
    color: 'black',
    marginTop: 4,
    fontWeight: 'bold',
    textAlign:'justify'
  },
  textPrice: {
    marginTop: 10,
    marginRight: 10,
    fontSize: 10
  },
  ratingContainer: {
    height: 20,
    width: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 2,
    borderColor: '#efe413',
    backgroundColor: '#efefe8'
  },
  rating: {
    marginLeft: 4,
    fontSize: 10,
    fontWeight: '500',
  },
  addButton: {
    padding: 8,
    marginLeft: 30
  },
});

export default ProductItem;
