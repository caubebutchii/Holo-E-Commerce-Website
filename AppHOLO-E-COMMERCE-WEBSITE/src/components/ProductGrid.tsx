import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ProductItem from './common/ProductItem';

const ProductGrid = ({ products, onProductPress }:any) => {
  const renderItem = ({ item }) => (
    <ProductItem product={item} onPress={() => onProductPress(item)} />
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

export default ProductGrid;