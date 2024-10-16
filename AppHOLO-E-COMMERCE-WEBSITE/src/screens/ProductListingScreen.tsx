import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import CategoryList from '../components/CategoryList';
import ProductGrid from '../components/ProductGrid';
type typeCategories = {
  id: string,
  name: string,
  icon: string
}
const ProductListingScreen = ({ navigation, category }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<typeCategories>(category);
  console.log(selectedCategory);

  const categories = [
    { id: 1, name: 'Điện tử', icon: 'phone-portrait-outline' },
    { id: 2, name: 'Thời trang', icon: 'shirt-outline' },
    { id: 3, name: 'Làm đẹp', icon: 'color-palette-outline' },
    { id: 4, name: 'Trái cây tươi', icon: 'nutrition-outline' },
  ];

  const products = [
    {
      id: 1,
      name: 'Điện thoại thông minh X',
      price: 999,
      image: 'https://example.com/smartphone-x.jpg',
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
    // Lọc sản phẩm dựa trên danh mục được chọn
    const filteredProducts = products.filter(product => product.category === category.name);
    // Cập nhật danh sách sản phẩm hiển thị (giả sử bạn có một state để lưu trữ sản phẩm hiển thị)
    // setDisplayedProducts(filteredProducts);

    // Nếu bạn muốn điều hướng đến một màn hình mới với danh sách sản phẩm đã lọc:
    // navigation.navigate('FilteredProducts', { products: filteredProducts, category: category.name });
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetails', { product });
  };
  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <Header onBackPress={handleBackPress} title={selectedCategory ? selectedCategory.name : "Tất cả sản phẩm"} showCart />
      <SearchBar placeholder="Tìm kiếm sản phẩm" />
      <CategoryList categories={categories} onCategoryPress={handleCategoryPress} />
      <ProductGrid products={prodcuts} onProductPress={handleProductPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default ProductListingScreen;