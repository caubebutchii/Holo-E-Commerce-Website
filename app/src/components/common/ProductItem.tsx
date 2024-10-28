import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductItem = ({ product, onPress }: any) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode='cover' />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={10} color="#FFD700" />
          <Text style={styles.rating}>{product.rating}</Text>
        </View>
        <View style={styles.priceRatingContainer}>
          <Text style={styles.price}>${product.price}</Text>
          <Text style ={styles.textPrice}>Đã bán 5,4k</Text>
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
    flex:1,
    marginRight:10
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
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10
  },
  price: {
    fontSize: 20,
    color: '#ed154b',
    marginTop: 4,
    fontWeight: 'bold'
  },
  textPrice:{
    marginTop:10,
    marginRight:10,
    fontSize:14
  },
  ratingContainer: {
    height: 20,
    width:40,
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