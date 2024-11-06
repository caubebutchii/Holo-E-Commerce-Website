import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Modal, TouchableWithoutFeedback, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import ProductGrid from '../components/ProductGrid';
import { app } from '../firebase/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }: any) => {
  const { product } = route.params;
  const [products, setProducts] = useState<any[]>([])
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [modalImage, setModalImage] = useState(product.image); // xử lý việc chọn màu trong modal
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false); // Trạng thái modal
  const [selectedAddOrBuy, setSelectedAddOrBuy] = useState('') //sử lý việc nhấn nút add hay buy
  const flatListRef = useRef<FlatList<any>>(null);
  const mainFlatListRef = useRef(null);

  const allImages = [product.image, ...Object.values(product.colorImages)];
  const colorEntries = Object.entries(product.colorImages);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let q = query(collection(db, 'items'), where('category', '==', product.category));;

        const querySnapshot = await getDocs(q);
        const fetchedProducts: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() });
        });

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };
    fetchProducts();

  }, [])
  const handleBackPress = () => {
    navigation.goBack();
  };
  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetails', { product });
  };
  const renderImageItem = ({ item }: any) => (
    <Image
      source={{ uri: item }}
      style={styles.carouselImage}
      resizeMode="cover"
    />
  );
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  const renderContent = () => (
    <>
      <View style={styles.imageContainer}>
        <FlatList
          ref={flatListRef}
          data={allImages}
          renderItem={renderImageItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {currentImageIndex + 1}/{allImages.length}
          </Text>
        </View>
      </View>

      <View style={styles.thumbnailContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Original image thumbnail */}
          <TouchableOpacity
            style={styles.thumbnailWrapper}
            onPress={() => {
              flatListRef.current?.scrollToIndex({ index: 0, animated: true });
            }}
          >
            <Image
              source={{ uri: product.image }}
              style={[
                styles.thumbnail,
                currentImageIndex === 0 && styles.selectedThumbnail
              ]}
            />
            <Text style={[
              styles.colorText,
              currentImageIndex === 0 && styles.selectedColorText
            ]}>
              Original
            </Text>
          </TouchableOpacity>

          {/* Color variants thumbnails */}
          {colorEntries.map(([color, image], index) => (
            <TouchableOpacity
              key={color}
              style={styles.thumbnailWrapper}
              onPress={() => {
                const targetIndex = index + 1; // +1 because original image is first
                flatListRef.current?.scrollToIndex({ index: targetIndex, animated: true });
                setSelectedColor(color);
              }}
            >
              <Image
                source={{ uri: image }}
                style={[
                  styles.thumbnail,
                  currentImageIndex === index + 1 && styles.selectedThumbnail
                ]}
              />
              <Text style={[
                styles.colorText,
                currentImageIndex === index + 1 && styles.selectedColorText
              ]}>
                {color}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.price}>
          ₫{product.price.toLocaleString()}
          <Text style={styles.originalPrice}> ₫{(product.price * 1.2).toLocaleString()}</Text>
        </Text>

        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
      <View>
      <View style={styles.containerRCM}>
      <View style={styles.leftBorder} />
      <Text style={styles.textRCM}>có thể bạn cũng thích</Text>
      <View style={styles.rightBorder} />
    </View>
        <ProductGrid
          products={products}
          onProductPress={handleProductPress}
        />
      </View>
    </>
  );
  const handleAddToCart = () => {
    const auth = getAuth(app);
  if (!auth.currentUser) {
    navigation.navigate('Welcome', {
      returnTo: {
        screen: 'ProductDetails',
        params: { product, action: 'addToCart' }
      }
    });
    return;
  }
    setSelectedAddOrBuy('Add to Card')
    setModalVisible(true);
  };

  const handleBuyNow = () => {
    const auth = getAuth(app);
  if (!auth.currentUser) {
    navigation.navigate('Welcome', {
      returnTo: {
        screen: 'ProductDetails',
        params: { product, action: 'buyNow' }
      }
    });
    return;
  }
    setSelectedAddOrBuy('Buy Now')
    setModalVisible(true);
  };
  const renderColorOption = ({ item: [color, image] }: any) => (
    <TouchableOpacity
      style={styles.colorOption}
      onPress={() => {
        setModalImage(image)
        setSelectedColor(color)
      }}
    >
      <Image
        source={{ uri: image }}
        style={styles.colorOptionImage}
      />
      <View style={[
        styles.colorOptionCheck,
        selectedColor === color && styles.colorOptionSelected
      ]}>
        {selectedColor === color && (
          <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
        )}
      </View>
      <Text style={styles.colorOptionText}>{color}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header onBackPress={handleBackPress} showCart />
      </View>

      <FlatList
        ref={mainFlatListRef}
        data={[1]}
        renderItem={() => renderContent()}
        keyExtractor={() => 'content'}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.chatButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#333" />
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={24} color="#333" />
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
      {/* Modal chọn màu sắc và kích thước */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/*thêm pressable phía trên modal để thực hiện việc thoát modal */}
          <Pressable style={{ height: '20%' }} onPress={() => setModalVisible(false)} />

          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            {/* Product Info Section */}
            <View style={styles.imageContainerModel}>
              <Image source={{ uri: modalImage }} style={styles.modelImage} />
              <View style={styles.modelInfo}>
                <Text style={styles.modelPrice}>
                  ₫{product.price.toLocaleString()}
                  <Text style={styles.modelOriginalPrice}>
                    ₫{(product.price * 1.2).toLocaleString()}
                  </Text>
                </Text>
                <Text style={styles.ModelAvailable}>
                  Kho: {product.available_quanlity}
                </Text>
              </View>
            </View>

            {/* Color Selection Section */}
            <View style={styles.colorSection}>
              <Text style={styles.sectionTitle}>Màu sắc</Text>
              <FlatList
                data={colorEntries}
                renderItem={renderColorOption}
                numColumns={2}
                keyExtractor={([color]) => color}
                columnWrapperStyle={styles.colorGrid}
              />
            </View>

            {/* Size Selection if applicable */}
            {product.category.toLowerCase().includes('thời trang') && (
              <View style={styles.sizeSection}>
                <Text style={styles.sectionTitle}>Size</Text>
                <View style={styles.sizeButtons}>
                  {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[styles.sizeButton, selectedSize === size && styles.selectedSize]}
                      onPress={() => setSelectedSize(size)}
                    >
                      <Text style={[styles.sizeButtonText, selectedSize === size && styles.selectedSizeText]}>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={() => {
                // Handle action based on selectedAddOrBuy
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalActionButtonText}>
                {selectedAddOrBuy === 'Buy Now' ? 'Mua ngay' : 'Thêm vào giỏ hàng'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  containerRCM: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    marginHorizontal:30
  },
  textRCM: {
    paddingHorizontal: 10, 
    textAlign:'center',
    fontWeight:'700',
    fontSize:15
  },
  leftBorder: {
    borderBottomWidth: 1,
    borderColor: '#000', // Màu border
    flex: 1, // Chiếm không gian còn lại
    marginRight: 10, // Khoảng cách giữa border và text
  },
  rightBorder: {
    borderBottomWidth: 1,
    borderColor: '#000', // Màu border
    flex: 1, // Chiếm không gian còn lại
    marginLeft: 10, // Khoảng cách giữa border và text
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    padding: 16,
  },
  modelInfo: {
    marginLeft: 16,
    marginTop: 20,
    flex: 1,
  },
  colorSection: {
    marginTop: 16,
  },
  sizeSection: {
    marginTop: 16,
  },
  colorGrid: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  colorOption: {
    width: '48%',
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorOptionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  colorOptionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  colorOptionCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  colorOptionSelected: {
    backgroundColor: '#fff',
  },
  modalActionButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 16,
  },
  modalActionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
  },
  modelImage: {
    width: 150,
    height: 150,
    borderRadius: 20
  },
  modelPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  modelOriginalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  imageContainerModel: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: 10
  },
  ModelAvailable: {
    marginTop: 20,
    fontSize: 15,
    color: '#999',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  carouselImage: {
    width: width,
    height: width,
  },
  pageIndicator: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pageIndicatorText: {
    color: '#fff',
    fontSize: 14,
  },
  thumbnailContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  thumbnailWrapper: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedThumbnail: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  colorText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  selectedColorText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  flashSaleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  flashSaleText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    marginRight: 8,
  },
  timerContainer: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  sizeContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sizeButtons: {
    flexDirection: 'row',
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  selectedSize: {
    backgroundColor: '#007AFF',
  },
  sizeButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  selectedSizeText: {
    color: 'white',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  chatButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButton: {
    flex: 2,
    backgroundColor: '#FF3B30',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;