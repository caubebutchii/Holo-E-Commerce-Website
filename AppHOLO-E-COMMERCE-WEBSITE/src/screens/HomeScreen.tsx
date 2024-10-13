import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import CategoryList from '../components/CategoryList';
import ProductGrid from '../components/ProductGrid';
import FeaturedBanner from '../components/FeaturedBanner';

const HomeScreen = ({ navigation }:any) => {
  const categories = [
    { id: 1, name: 'Electronics', icon: 'phone-portrait-outline' },
    { id: 2, name: 'Fashion', icon: 'shirt-outline' },
    { id: 3, name: 'Beauty', icon: 'color-palette-outline' },
    { id: 4, name: 'Fresh Fruits', icon: 'nutrition-outline' },
  ];

  const featuredProduct = {
    id: 1,
    name: 'Shoes',
    discount: '50% off',
    image: 'https://example.com/shoes-image.jpg',
  };

  const recommendedProducts = [
    { id: 1, name: 'Shoes', price: 299, rating: 4.5, image: 'https://example.com/shoes-image.jpg' },
    { id: 2, name: 'Tablet', price: 499, rating: 4.5, image: 'https://example.com/tablet-image.jpg' },
    { id: 3, name: 'Pear', price: 4, rating: 4.5, image: 'https://example.com/pear-image.jpg' },
  ];

  const handleCategoryPress = (category:any) => {
    navigation.navigate('ProductListing', { category });
  };

  const handleProductPress = (product:any) => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleSearch = (text:any) => {
    // Handle search functionality
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="All Deals" showCart />
      <SearchBar placeholder="Search for product" onChangeText={handleSearch} />
      <CategoryList categories={categories} onCategoryPress={handleCategoryPress} />
      <FeaturedBanner product={featuredProduct} onPress={() => handleProductPress(featuredProduct)} />
      <ProductGrid
        title="Recommended for you"
        products={recommendedProducts}
        onProductPress={handleProductPress}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default HomeScreen;