import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import CategoryList from '../components/CategoryList';
import ProductGrid from '../components/ProductGrid';
import FeaturedBanner from '../components/FeaturedBanner';
import DiscountedBanner from '../components/DiscountedBanner';

import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, updateDoc, where,doc } from "firebase/firestore";
import AddProduct from '../firebase/addData';
import AddProducts from '../firebase/addData';

const HomeScreen = ({ navigation }: any) => {
  const [categories, setCategories] = useState<{ id: string;[key: string]: any }[]>([]);
  const [products, setProducts] = useState<{ id: string;[key: string]: any }[]>([]);
  useEffect(() => {
    const fetchDataCate = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const fetchedItems: { id: string;[key: string]: any }[] = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });
        setCategories(fetchedItems);
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
    };
    const fetchDataItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'items'));
        const fetchedItems: { id: string;[key: string]: any }[] = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });
        setProducts(fetchedItems);
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
    };
    // const addTagsToFashionItems = async () => {
    //   try {
    //     // Bước 1: Truy vấn các items có category bao gồm 'thời trang nam'
    //     const itemsRef = collection(db, 'items');
    //     const q = query(itemsRef, where('name', '==', 'Quần jean nam chữ thập thêu ống suông rộng xanh đen, Quần chun kaki túi hộp chất vải dày dặn cao cấp style hàn quốc 2022'));
    //     const querySnapshot = await getDocs(q);
    
    //     // Bước 2: Cập nhật từng item để thêm mảng tags
    //     const tags = ["Quần jean", "Nam", "Ống suông", "Xanh đen", "Kaki", "Chất vải dày", "Phong cách Hàn Quốc"]; // Mảng tags bạn muốn thêm
    
    //     const updatePromises = querySnapshot.docs.map(async (doc) => {
    //       const itemRef = doc(db, 'items', doc.id);
    //       await updateDoc(itemRef, {
    //         tags: tags // Thêm mảng tags vào item
    //       });
    //     });
    
    //     // Chờ tất cả các cập nhật hoàn thành
    //     await Promise.all(updatePromises);
    //     console.log('Tags added to all fashion items successfully!');
    //   } catch (error) {
    //     console.error('Error adding tags: ', error);
    //   }
    // };
    
    // // Gọi hàm
    // addTagsToFashionItems();
    fetchDataCate();
    fetchDataItems();
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

  // Render item function for FlatLists
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
          <View style={styles.section}>
            <View style={{ ...styles.ProductHeader, }}>
              <Text style={styles.sectionTitle}>Popular Products</Text>
              <TouchableOpacity
                onPress={() => {
                  handleCategoryPress(null)
                }}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginRight: -10 }}>
              <ProductGrid
                products={products}
                onProductPress={handleProductPress}
              />
            </View>
          </View>

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
      {/* <AddProducts productsData={products} /> */}
      <FlatList
        data={data}
        renderItem={renderItem}
        // renderItem={({ item }) => (
        //   <renderItem
        //     key={item.id}  // Sử dụng id làm key
        //     item={item}
        //   />
        // )}
        // keyExtractor={(item, index) => idndex.tosssString()}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id ? item.id.toString() : item.name}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  ProductHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,

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