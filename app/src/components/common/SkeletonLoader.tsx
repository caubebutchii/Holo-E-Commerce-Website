import React, { useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ShimmerEffect = () => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <Animated.View
      style={[
        styles.shimmer,
        {
          transform: [{ translateX }],
        },
      ]}
    />
  );
};

const SkeletonItem = ({ style }: { style?: object }) => (
  <View style={[styles.skeletonItem, style]}>
    <ShimmerEffect />
  </View>
);

const SkeletonLoader = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <SkeletonItem style={styles.backButton} />
        <SkeletonItem style={styles.headerTitle} />
        <SkeletonItem style={styles.cartButton} />
      </View>

      {/* Search Bar Skeleton */}
      <View style={styles.searchBar}>
        <SkeletonItem style={styles.searchInput} />
        <SkeletonItem style={styles.filterButton} />
      </View>

      {/* Category List Skeleton */}
      <View style={styles.categoryList}>
        {[...Array(5)].map((_, index) => (
          <SkeletonItem key={`category-${index}`} style={styles.categoryItem} />
        ))}
      </View>

      {/* Product Grid Skeleton */}
      <View style={styles.productGrid}>
        {[...Array(4)].map((_, index) => (
          <View key={`product-${index}`} style={styles.productItem}>
            <SkeletonItem style={styles.productImage} />
            <SkeletonItem style={styles.productTitle} />
            <SkeletonItem style={styles.productPrice} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#99FFEE',
  },
  skeletonItem: {
    backgroundColor: '#E1E9EE',
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    height: 60,
  },
  backButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  headerTitle: {
    width: 150,
    height: 24,
    borderRadius: 4,
  },
  cartButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  searchBar: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  categoryList: {
    flexDirection: 'row',
    padding: 16,
  },
  categoryItem: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  productItem: {
    width: '50%',
    padding: 8,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  productTitle: {
    width: '80%',
    height: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  productPrice: {
    width: '50%',
    height: 16,
    borderRadius: 4,
  },
});

export default SkeletonLoader;