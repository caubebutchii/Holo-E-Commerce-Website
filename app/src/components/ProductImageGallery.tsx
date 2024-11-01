import React, { useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface ProductImageGalleryProps {
  images: { [color: string]: string };
  initialColor: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, initialColor }) => {
  const [selectedImage, setSelectedImage] = useState(images[initialColor]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: selectedImage }} style={styles.mainImage} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailScroll}>
        {Object.entries(images).map(([color, image]) => (
          <TouchableOpacity
            key={color}
            onPress={() => setSelectedImage(image)}
            style={[
              styles.thumbnailContainer,
              selectedImage === image && styles.selectedThumbnail,
            ]}
          >
            <Image source={{ uri: image }} style={styles.thumbnailImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    
  },
  mainImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
    borderRadius:20
  },
  thumbnailScroll: {
    paddingVertical: 10,
  },
  thumbnailContainer: {
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#007AFF',
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
  },
});

export default ProductImageGallery;