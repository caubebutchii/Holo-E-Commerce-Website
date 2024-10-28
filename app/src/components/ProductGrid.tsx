import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ProductItem from './common/ProductItem';

const ProductGrid = ({ title, products, onProductPress }: any) => {
  const renderItem = ({ item }:any) => (
    <ProductItem product={item} onPress={() => onProductPress(item)} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 16,
    color: '#333',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default ProductGrid;