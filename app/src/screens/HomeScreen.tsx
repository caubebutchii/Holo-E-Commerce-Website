import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import CategoryList from '../components/CategoryList';
import ProductGrid from '../components/ProductGrid';
import FeaturedBanner from '../components/FeaturedBanner';
import DiscountedBanner from '../components/DiscountedBanner';

import { db } from '../firebaseConfig/firebaseConfig';
import { collection, getDocs } from "firebase/firestore";

const HomeScreen = ({ navigation }: any) => {
  const [categories, setCategories] = useState<{ id: string; [key: string]: any }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const fetchedItems: { id: string; [key: string]: any }[] = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });
        setCategories(fetchedItems);
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
    };

    fetchData();
  }, []);

  const featuredProductShoe = {
    id: 1,
    name: 'Shoes',
    discount: '50% off',
    image: 'https://firebasestorage.googleapis.com/v0/b/commerce-9e46f.appspot.com/o/shoes%2Fpexels-desertedinurban-4462781.jpg?alt=media&token=1de69849-7e62-40ab-8060-43b30c436592',
  };
  const featuredProductFashion = {
    id: 2,
    name: 'túi sách nữ thời trang',
    discount: '30%',
    image: 'https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2Fwomen%20bag.jpg?alt=media&token=cc01787c-95a4-436a-892d-9cedd468ebcb',
  };
  const featuredProductElectronic = {
    id: 3,
    name: 'Iphone X',
    discount: '45%',
    image: 'https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fphone%2FiphoneX.jpg?alt=media&token=6477f96a-676b-4efa-af7e-7b87d1d969b1',
  };
  const recommendedProducts = [
    { id: 1, name: 'Shoes', price: 299, rating: 4.5, image: 'https://firebasestorage.googleapis.com/v0/b/commerce-9e46f.appspot.com/o/shoes%2Fpexels-lilartsy-1159670.jpg?alt=media&token=0e26c824-26d5-4a94-8d85-478d0048fbe0' },
    { id: 2, name: 'Tablet', price: 499, rating: 4.5, image: 'https://firebasestorage.googleapis.com/v0/b/commerce-9e46f.appspot.com/o/table%2Fpexels-ravindar-negi-2150635-3785868.jpg?alt=media&token=618f2e66-8880-499a-b280-73fa430087b7' },
    { id: 3, name: 'Set đồ nam cá nhà bà tính', price: 499, category: 'thời trang nam', colors: [{ color: 'red' }, { color: 'blue' }], rating: 4.5, image: 'https://firebasestorage.googleapis.com/v0/b/commerce-9e46f.appspot.com/o/Fashion%2Fset%2Fpexels-pixabay-157675.jpg?alt=media&token=35e1bcdd-d528-4843-92e0-23c968f02a5b' },
    {
      id: "1",
      name: "Áo thun nam cổ tròn",
      price: 299000,
      image: "https://firebasestorage.googleapis.com/v0/b/commerce-9e46f.appspot.com/o/Fashion%2Fset%2Fpexels-pixabay-157675.jpg?alt=media&token=35e1bcdd-d528-4843-92e0-23c968f02a5b",
      description: "Áo thun namm cổ tròn chất liệu cotton 100%, thoáng mát, thấm hút mồ hôi tốt. Thiết kế đơn giản, dễ phối đồ, phù hợp cho nhiều dịp khác nhau.",
      category: "thời trang nam",
      rating: 4.5,
      colors: ["Trắng", "Đen", "Xanh navy"],
      colorImages: {
        "Trắng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fphone%2FiphoneX.jpg?alt=media&token=6477f96a-676b-4efa-af7e-7b87d1d969b1",
        "Đen": "https://firebasestorage.googleapis.com/v0/b/commerce-9e46f.appspot.com/o/shoes%2Fpexels-desertedinurban-4462781.jpg?alt=media&token=1de69849-7e62-40ab-8060-43b30c436592",
        "Xanh navy": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/bg%2Fpexels-n-voitkevich-6214479.jpg?alt=media&token=649d49a2-6197-4d41-bd11-a07631402bd6"
      }
    }
  ];

  const handleCategoryPress = (category: any) => {
    navigation.navigate('ProductListing', { category, categories });
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleSearch = (text: string) => {
    // Handle search functionality
  };

  const handleFilter = () => {
    navigation.navigate('filter');
  };

  // Render item function for FlatList
  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
        return <Header title="All Deals" showCart />;
      case 'search':
        return <SearchBar placeholder="Search for product" onChangeText={handleSearch} onPressFilter={handleFilter} />;
      case 'categoryList':
        return <CategoryList categories={categories} onCategoryPress={handleCategoryPress} />;
      case 'featuredBanner':
        return <FeaturedBanner product={featuredProductShoe} onPress={() => handleProductPress(featuredProductShoe)} />;
      case 'discountedBanner':
        return (
          <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.featuredContainer}>
            <DiscountedBanner item={featuredProductFashion} onPress={() => handleProductPress(featuredProductFashion)} />
            <DiscountedBanner item={featuredProductElectronic} onPress={() => handleProductPress(featuredProductElectronic)} />
          </View>
        </View>
        );
      case 'productGrid':
        return (
          <ProductGrid
            title="Popular Products"
            products={recommendedProducts}
            onProductPress={handleProductPress}
          />
        );
      default:
        return null;
    }
  };

  // Data for FlatList
  const data = [
    { type: 'header' },
    { type: 'search' },
    { type: 'categoryList' },
    { type: 'featuredBanner' },
    { type: 'discountedBanner' },
    { type: 'productGrid' },
  ];

  return (
    <LinearGradient colors={['#E6F3FF', '#FFFFFF']} style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  featuredContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});

export default HomeScreen;