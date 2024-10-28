import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';

const CategoryList = ({ categories, onCategoryPress }: any) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
    >
      {categories.map((category: any) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryButton}
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
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  categoryButton: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 70, // Fixed width for consistent layout
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden', // Ensure the image doesn't overflow the circular container
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
    maxWidth: 70, // Ensure text doesn't overflow the button width
  },
});

export default CategoryList;