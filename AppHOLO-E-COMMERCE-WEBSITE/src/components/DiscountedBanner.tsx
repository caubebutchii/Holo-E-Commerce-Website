import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const DiscountedBanner = ({ item, onPress }: { item: any; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.discountContainer}>
        <Text style={styles.discountText}>{item.discount}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 150, // Đặt chiều rộng cho banner
    height: 150, // Đặt chiều cao cho banner
    marginHorizontal:20, marginTop:5,marginBottom:10,
    borderRadius: 10,
    overflow: 'hidden', // Để bo góc cho hình ảnh
    backgroundColor: 'white', // Màu nền cho banner
    elevation: 2, // Đổ bóng cho banner
    flex:1
  },
  discountContainer: {
    position: 'absolute',
    top: 10,
    backgroundColor: '#B6330B', // Màu nền cho nhãn giảm giá
    borderRadius: 5,
    padding: 5,
    zIndex: 1,
    borderTopRightRadius:20,
    borderBottomRightRadius:20
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    paddingHorizontal: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: 'gray',
    paddingHorizontal: 5,
  },
});

export default DiscountedBanner;