import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, Image, View, FlatList } from 'react-native';

const CategoryList = ({ categories, onCategoryPress, scroll }: any) => {
  // Giới hạn số lượng phần tử hiển thị
  // const limitedCategories = categories.slice(0, 8); // Lấy 8 phần tử đầu tiên nếu cần

  if (scroll) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
        {categories.map((category:any) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryButtonScroll}
            onPress={() => onCategoryPress(category)}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: category.img }}
                style={styles.categoryImage}
              />
            </View>
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  } else {
    return (
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            style={styles.categoryButton}
            onPress={() => onCategoryPress(item)}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.img }}
                style={styles.categoryImage}
              />
            </View>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={4} 
        showsVerticalScrollIndicator={false}
        style={{ marginLeft: 12 }}
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 16,
    marginTop:10,
    marginBottom:-10,
    paddingHorizontal: 16,
  },
  categoryButton: {
    alignItems: 'center',
    margin: 4,
    flex: 1, 
  },
  categoryButtonScroll:{
    alignItems: 'center',
    marginRight:25,
    flex: 1, 
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    maxWidth: 70,
  },
});

export default CategoryList;