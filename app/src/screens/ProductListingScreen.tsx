import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import CategoryList from '../components/CategoryList';
import ProductGrid from '../components/ProductGrid';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

type typeCategories = {
  id: string;
  name: string;
  icon: string;
};

const ProductListingScreen = ({ navigation, route }: any) => {
  const { category,searchQuery } = route.params;
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<typeCategories | null>(category || null);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery || '');
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchDataCate = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const fetchedItems: { id: string; [key: string]: any }[] = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });
        setCategoryList(fetchedItems);
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
    };

    const fetchProducts = async () => {
      try {
        let q;

        if (selectedCategory && selectedCategory.name) {
          q = query(collection(db, 'items'), where('category', '==', selectedCategory.name));
        } else {
          q = collection(db, 'items');
        }

        const querySnapshot = await getDocs(q);
        const fetchedProducts: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() });
        });
        setProducts(fetchedProducts);
        filterProducts(fetchedProducts, currentSearchQuery);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };

    fetchDataCate();
    fetchProducts();
  }, [selectedCategory]);

  const handleCategoryPress = (category: any) => {
    setCurrentSearchQuery('')
    setSelectedCategory(category);
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const filterProducts = (productsToFilter: any[], searchText: string) => {
    if (!searchText.trim()) {
      setFilteredProducts(productsToFilter);
      return;
    }

    const filtered = productsToFilter.filter(product => {
      // Search in name
      const nameMatch = product.name.toLowerCase().includes(searchText.toLowerCase());
      
      // Search in tags if they exist
      const tagMatch = product.tags ? 
        product.tags.some((tag: string) => 
          tag.toLowerCase().includes(searchText.toLowerCase())
        ) : false;

      return nameMatch || tagMatch;
    });

    setFilteredProducts(filtered);
  };
  const handleSearch = (text: string) => {
    setCurrentSearchQuery(text);
  };
  const handlePressSearch = ()=>{
    filterProducts(products, currentSearchQuery);
  }
  const handleFilter = () => {
    navigation.navigate('filter');
  };

  // Render item function for FlatList
  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
        return <Header 
        onBackPress={handleBackPress} 
        title={currentSearchQuery ? 
          `Kết quả tìm kiếm: ${filteredProducts.length}` : 
          selectedCategory ? selectedCategory.name : "Tất cả sản phẩm"
        }  showCart />;
      case 'search':
        return <SearchBar placeholder="Tìm kiếm sản phẩm" onChangeText={handleSearch} onPressSearch={handlePressSearch} onPressFilter={handleFilter} />;
      case 'categoryList':
        return <CategoryList categories={categoryList} onCategoryPress={handleCategoryPress} scroll />;
      case 'productGrid':
        return (
            <ProductGrid products={filteredProducts} onProductPress={handleProductPress} />
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
    { type: 'productGrid' },
  ];

  return (
    <LinearGradient colors={['#E6F3FF', '#FFFFFF']} style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()} // Sử dụng index làm key
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
  },
});

export default ProductListingScreen;