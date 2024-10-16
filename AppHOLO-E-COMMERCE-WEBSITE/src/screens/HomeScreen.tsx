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
    image: 'https://firebasestorage.googleapis.com/v0/b/commerce-9e46f.appspot.com/o/shoes%2Fpexels-desertedinurban-4462781.jpg?alt=media&token=1de69849-7e62-40ab-8060-43b30c436592',
  };

  const recommendedProducts = [
    { id: 1, name: 'Shoes', price: 299, rating: 4.5, image: 'https://firebasestorage.googleapis.com/v0/b/commerce-9e46f.appspot.com/o/shoes%2Fpexels-lilartsy-1159670.jpg?alt=media&token=0e26c824-26d5-4a94-8d85-478d0048fbe0' },
    { id: 2, name: 'Tablet', price: 499, rating: 4.5, image: 'https://firebasestorage.googleapis.com/v0/b/commerce-9e46f.appspot.com/o/table%2Fpexels-ravindar-negi-2150635-3785868.jpg?alt=media&token=618f2e66-8880-499a-b280-73fa430087b7' },
    { id: 3, name: 'Set đồ nam cá nhà bà tính', price: 499, rating: 4.5, image: 'https://firebasestorage.googleapis.com/v0/b/commerce-9e46f.appspot.com/o/Fashion%2Fset%2Fpexels-pixabay-157675.jpg?alt=media&token=35e1bcdd-d528-4843-92e0-23c968f02a5b' },
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
  const handleFilter = ()=>{
    navigation.navigate('filter')
  }
  return (
    <ScrollView style={styles.container}>
      <Header title="All Deals" showCart />
      <SearchBar placeholder="Search for product" onChangeText={handleSearch} onPressFilter = {handleFilter} />
      <CategoryList categories={categories} onCategoryPress={handleCategoryPress}  />
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
    backgroundColor: '#f4f6f7',
  },
});

export default HomeScreen;