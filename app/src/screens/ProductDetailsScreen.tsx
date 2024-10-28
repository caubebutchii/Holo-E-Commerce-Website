import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/common/Header';
import ReviewList from '../components/ReviewList';
import ProductImageGallery from '../components/ProductImageGallery';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }: any) => {
  const { product } = route.params;
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const fashionCategories = ["thời trang nữ", "thời trang nam", "giày nữ"];
  const showSizeSelection = fashionCategories.includes(product.category.toLowerCase());

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', { ...product, size: selectedSize, color: selectedColor, quantity });
  };

  const renderHeader = () => (
    <>
      <ProductImageGallery images={product.colorImages} initialColor={selectedColor} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.priceRatingContainer}>
          <Text style={styles.price}>${product.price}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{product.rating} (99 reviews)</Text>
          </View>
        </View>
        <Text style={styles.description}>{product.description || 'No description available.'}</Text>
        
        <View style={styles.colorContainer}>
          <Text style={styles.sectionTitle}>Color</Text>
          <View style={styles.colorButtons}>
            {product.colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorButton, { backgroundColor: color }, selectedColor === color && styles.selectedColor]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        {showSizeSelection && (
          <View style={styles.sizeContainer}>
            <Text style={styles.sectionTitle}>Size</Text>
            <View style={styles.sizeButtons}>
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[styles.sizeButton, selectedSize === size && styles.selectedSize]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[styles.sizeButtonText, selectedSize === size && styles.selectedSizeText]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.quantityContainer}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Ionicons name="remove" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => setQuantity(quantity + 1)}
            >
              <Ionicons name="add" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.reviewsContainer}>
        <Text style={styles.sectionTitle}>Reviews</Text>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E6F3FF', '#FFFFFF']} style={styles.gradient}>
        <Header title={product.name} onBackPress={handleBackPress} showCart />
        <FlatList
          data={[]}
          renderItem={null}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={<ReviewList productId={product.id} />}
        />
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>Add to cart</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // marginTop: -24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#333',
    marginBottom: 8,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: 'gray',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  colorContainer: {
    marginBottom: 16,
  },
  colorButtons: {
    flexDirection: 'row',
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  sizeContainer: {
    marginBottom: 16,
  },
  sizeButtons: {
    flexDirection: 'row',
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  selectedSize: {
    backgroundColor: '#007AFF',
  },
  sizeButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  selectedSizeText: {
    color: 'white',
  },
  quantityContainer: {
    marginBottom: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    padding: 4,
  },
  quantityButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  reviewsContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 30,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;