import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Modal, TouchableWithoutFeedback, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import { collection, getDocs, query, where, doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import ProductGrid from '../components/ProductGrid';
import { useUser } from '../context/UserContext';

const { width, height } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }: any) => {
  const { product } = route.params;
  const { user } = useUser(); 
  const [products, setProducts] = useState<any[]>([])
  const [selectedSize, setSelectedSize] = useState(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
  const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0] : null);
  const [modalImage, setModalImage] = useState(product.image);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddOrBuy, setSelectedAddOrBuy] = useState('')
  const flatListRef = useRef<FlatList<any>>(null);
  const mainFlatListRef = useRef(null);

  const allImages = [product.image, ...Object.values(product.colorImages || {})];
  const colorEntries = Object.entries(product.colorImages || {});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let q = query(collection(db, 'items'), where('category', '==', product.category));
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

  const handleAddToCart = async () => {
    // nếu user không tồn tại thì chuyển về welcome screen
    if (!user.uid) {
      navigation.navigate('Welcome');
      return;
    }

    try {
      // lấy giỏ hàng của user
      const cartRef = doc(db, 'carts', user.uid);
      const cartDoc = await getDoc(cartRef);

      // tạo item mới, thông tin item bao gồm id, name, price, image, color, size, quantity
      // lấy từ product và state selectedColor, selectedSize
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color: selectedColor,
        size: selectedSize,
        quantity: 1
      };

      // nếu giỏ hàng đã tồn tại
      if (cartDoc.exists()) {
        // lấy thông tin giỏ hàng
        const cartData = cartDoc.data();
        // tìm xem item đã tồn tại trong giỏ hàng chưa
        // kiểm tra các trường id, color, size
        const existingItemIndex = cartData.items.findIndex((item: any) => 
          item.id === product.id && item.color === selectedColor && item.size === selectedSize
        );

        if (existingItemIndex !== -1) {
          // nếu item đã tồn tại thì tăng số lượng lên 1
          cartData.items[existingItemIndex].quantity += 1;
          await updateDoc(cartRef, { items: cartData.items });
        } else {
          // nếu item chưa tồn tại thì thêm item mới vào giỏ hàng
          await updateDoc(cartRef, {
            items: arrayUnion(newItem)
          });
        }
      } else {
        // nếu giỏ hàng chưa tồn tại thì tạo giỏ hàng mới
        // với item là mảng chứa item mới
        await setDoc(cartRef, {
          items: [newItem]
        });
      }
      // hiển thị thông báo thành công và đóng modal
      Alert.alert('Success', 'Product added to cart successfully');
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding to cart: ", error);
      Alert.alert('Error', 'Failed to add product to cart');
    }
  };

  const handleBuyNow = () => {
    if (user.uid === '') {
      navigation.navigate('Welcome');
      return;
    }
    // default color là màu đầu tiên trong mảng colors của product
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : null;
    // default size là size đầu tiên trong mảng sizes của product
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
    // chuyển sang checkout screen với thông tin sản phẩm, màu, size, số lượng, buyNow = true
    navigation.navigate('Checkout', { 
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      }, 
      color: defaultColor, 
      size: defaultSize, 
      quantity: 1, 
      buyNow: true
    });
  };

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

          {colorEntries.map(([color, image], index) => (
            <TouchableOpacity
              key={color}
              style={styles.thumbnailWrapper}
              onPress={() => {
                const targetIndex = index + 1;
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header onBackPress={handleBackPress} showCart transparent />
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

        <TouchableOpacity style={styles.cartButton} onPress={() => {
          setSelectedAddOrBuy('Add to Cart');
          setModalVisible(true);
        }}>
          <Ionicons name="cart-outline" size={24} color="#333" />
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable style={{ height: '20%' }} onPress={() => setModalVisible(false)} />

          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

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

            {product.category.toLowerCase().includes('thời trang') && product.sizes && (
              <View style={styles.sizeSection}>
                <Text style={styles.sectionTitle}>Size</Text>
                <View style={styles.sizeButtons}>
                  {product.sizes.map((size: string) => (
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

            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={handleAddToCart}
            >
              <Text style={styles.modalActionButtonText}>
                Thêm vào giỏ hàng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  containerRCM: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30
  },
  textRCM: {
    paddingHorizontal: 10, 
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15
  },
  leftBorder: {
    borderBottomWidth: 1,
    borderColor: '#000',
    flex: 1,
    marginRight: 10,
  },
  rightBorder: {
    borderBottomWidth: 1,
    borderColor: '#000',
    flex: 1,
    marginLeft: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  imageContainerModel: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  modelImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  modelInfo: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  modelPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  modelOriginalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  ModelAvailable: {
    marginTop: 8,
    color: '#666',
  },
  colorSection: {
    marginBottom: 16,
  },
  sizeSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  colorGrid: {
    justifyContent: 'space-between',
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
  sizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  modalActionButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  modalActionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;

