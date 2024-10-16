import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ProductItem from './common/ProductItem';

const ProductGrid = ({ title, products, onProductPress }: any) => {
  const renderItem = ({ item }) => (
    <ProductItem product={item} onPress={() => onProductPress(item)} />
  );

  return (
    <View style= {styles.container}>
      <Text style= {styles.title}>{title}</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ marginRight: -10 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title:{
    fontWeight:'bold',
    fontSize:13
  }
});

export default ProductGrid;
