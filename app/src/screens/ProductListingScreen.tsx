import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import CategoryList from '../components/CategoryList';
import ProductGrid from '../components/ProductGrid';

type typeCategories = {
  id: string,
  name: string,
  icon: string
}

const ProductListingScreen = ({ navigation, route }: any) => {
  const { category, categories } = route.params;
  const [selectedCategory, setSelectedCategory] = useState<typeCategories>(category);

  const products = [
    {
      id: 1,
      name: 'Điện thoại thông minh iphone X',
      price: 999,
      image: 'https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fphone%2FiphoneX.jpg?alt=media&token=6477f96a-676b-4efa-af7e-7b87d1d969b1',
      rating: 4.5,
      category: 'Điện tử'
    },
    {
      id: 2,
      name: 'Laptop Ultra',
      price: 1299,
      image: 'https://example.com/laptop-ultra.jpg',
      rating: 4.7,
      category: 'Điện tử'
    },
    {
      id: 3,
      name: 'Áo thun Classic',
      price: 29,
      image: 'https://example.com/classic-tshirt.jpg',
      rating: 4.2,
      category: 'Thời trang'
    },
    {
      id: 4,
      name: 'Quần jean Slim Fit',
      price: 59,
      image: 'https://example.com/slim-fit-jeans.jpg',
      rating: 4.0,
      category: 'Thời trang'
    },
    {
      id: 5,
      name: 'Kem dưỡng da Hydra',
      price: 45,
      image: 'https://example.com/hydra-moisturizer.jpg',
      rating: 4.8,
      category: 'Làm đẹp'
    },
    {
      id: 6,
      name: 'Son môi Velvet',
      price: 25,
      image: 'https://example.com/velvet-lipstick.jpg',
      rating: 4.6,
      category: 'Làm đẹp'
    },
    {
      id: 7,
      name: 'Táo Fuji hữu cơ',
      price: 3.99,
      image: 'https://example.com/organic-fuji-apple.jpg',
      rating: 4.9,
      category: 'Trái cây tươi'
    },
    {
      id: 8,
      name: 'Chuối Cavendish',
      price: 2.49,
      image: 'https://example.com/cavendish-banana.jpg',
      rating: 4.7,
      category: 'Trái cây tươi'
    },
  ];

  const handleCategoryPress = (category: any) => {
    setSelectedCategory(category);
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSearch = (text: string) => {
    // Handle search functionality
  };

  const handleFilter = () => {
    navigation.navigate('filter');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://example.com/background-image.jpg' }}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['#E6F3FF', '#FFFFFF']}
        style={styles.container}
      >
        <Header onBackPress={handleBackPress} title={selectedCategory ? selectedCategory.name : "Tất cả sản phẩm"} showCart />
        <SearchBar placeholder="Tìm kiếm sản phẩm" onChangeText={handleSearch} onPressFilter={handleFilter} />
          <View style={styles.categoryListContainer}>
            <CategoryList categories={categories} onCategoryPress={handleCategoryPress} />
          </View>
          <ProductGrid products={products} onProductPress={handleProductPress} />
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  categoryListContainer: {
    marginBottom: -50,
  },
});

export default ProductListingScreen;