import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import CategoryList from '../components/CategoryList';
import ProductGrid from '../components/ProductGrid';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import SkeletonLoader from '../components/common/SkeletonLoader';

type typeCategories = {
  id: string;
  name: string;
  icon: string;
};

const ProductListingScreen = ({ navigation, route }: any) => {
  const { category, searchQuery, filters: initialFilters } = route.params;
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<typeCategories | null>(category || null);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery || '');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const fetchDataCate = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const fetchedItems: { id: string;[key: string]: any }[] = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });
        setCategoryList(fetchedItems);
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
      finally {
        setLoading(false);
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
  
  useEffect(() => {//lọc theo filters
    if (filters) {
      const filtered = products.filter(product => {
        const priceInRange = product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;
        const ratingMatch = product.rating >= filters.rating;
        const categoryMatch = !filters.category || product.category === filters.category;
        const tagsMatch = filters.tags.length === 0 || (product.tags && filters.tags.some((tag: any) => product.tags.includes(tag)));
        const colorsMatch = filters.colors.length === 0 || (product.colors && filters.colors.some((color: any) => product.colors.includes(color)));

        return priceInRange && ratingMatch && categoryMatch && tagsMatch && colorsMatch;
      });

      setFilteredProducts(filtered);
    }
  }, [filters, products]);
  const handleCategoryPress = (category: any) => {
    setCurrentSearchQuery('')
    setSelectedCategory(category);
    setFilters(null); // Reset filters when a category is selected
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
  const handlePressSearch = () => {
    filterProducts(products, currentSearchQuery);
  }
  const applyFilters = (productsToFilter: any[]) => {
    if (filters) {
      const filtered = productsToFilter.filter(product => {
        const priceInRange = product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;
        const ratingMatch = product.rating >= filters.rating;
        const categoryMatch = !filters.category || product.category === filters.category;
        const tagsMatch = filters.tags.length === 0 || (product.tags && filters.tags.some((tag: any) => product.tags.includes(tag)));
        const colorsMatch = filters.colors.length === 0 || (product.colors && filters.colors.some((color: any) => product.colors.includes(color)));

        return priceInRange && ratingMatch && categoryMatch && tagsMatch && colorsMatch;
      });

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(productsToFilter);
    }
  };
  const handleFilter = () => {
    navigation.navigate('Filter', { 
      onApplyFilters: (newFilters: any) => {
        setFilters(newFilters);
        applyFilters(products);
      }
    });
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
          } showCart />;
      case 'search':
        return(
          <SearchBar
              placeholder="Search for product"
              onChangeText={handleSearch}
              onPressSearch={handlePressSearch}
              onPressFilter={handleFilter}
            />
        );

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
    <View style={styles.container}>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <LinearGradient colors={['#dcf1f9', '#d3e6ef']} style={styles.container}>
          <FlatList
            data={data}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()} // Sử dụng index làm key
          />
        </LinearGradient>
      )}
    </View>
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