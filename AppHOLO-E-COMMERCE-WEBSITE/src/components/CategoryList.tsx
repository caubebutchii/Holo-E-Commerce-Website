import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';

import { View, Image } from 'react-native'; // Thêm import Image

const CategoryList = ({ categories, onCategoryPress }: any) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map((category: any) => (
        <View key={category.id} style={styles.container}>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => onCategoryPress(category)}
          >
            <Image
              source={{ uri: category.img }} // Gọi thuộc tính img
              style={styles.categoryImage} // Áp dụng kiểu cho hình ảnh
            />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal:5,
    marginRight:10,
  },
  categoryButton: {
    justifyContent: 'center', // Căn giữa nội dung
    alignItems: 'center', // Căn giữa nội dung
  },
  categoryImage: {
    width: 90, // Đặt chiều rộng cho hình ảnh
    height: 90, // Đặt chiều cao cho hình ảnh
    borderRadius: 40, // Tạo hình tròn cho hình ảnh
    marginBottom: 5, // Khoảng cách giữa hình ảnh và tên category
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black', // Màu chữ
    fontFamily:'Roboto'
  },
});

export default CategoryList;
