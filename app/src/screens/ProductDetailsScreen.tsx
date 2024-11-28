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
  const [quantity, setQuantity] = useState(1);// xử lý chọn số lượng
  const [selectedAddOrBuy, setSelectedAddOrBuy] = useState('')
  const flatListRef = useRef<FlatList<any>>(null);
  const mainFlatListRef = useRef(null);

  const allImages = [
    product.image,
    ...Object.values(product.colorImages || {}).map((colorData:any) => colorData.image)
  ];
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
    if (!user.uid) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
      return;
    }

    const availableQuantity = product.colorImages[selectedColor]?.available_quantity || 0;
    if (quantity > availableQuantity) {
      Alert.alert('Thông báo', `Chỉ còn ${availableQuantity} sản phẩm trong kho.`);
      return;
    }

    try {
      const cartRef = doc(db, 'carts', user.uid);
      const cartDoc = await getDoc(cartRef);

      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.colorImages[selectedColor]?.image || product.image,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity
      };

      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const existingItemIndex = cartData.items.findIndex((item: any) =>
          item.id === product.id && item.color === selectedColor && item.size === selectedSize
        );

        if (existingItemIndex !== -1) {
          cartData.items[existingItemIndex].quantity += quantity;
          await updateDoc(cartRef, { items: cartData.items });
        } else {
          await updateDoc(cartRef, {
            items: arrayUnion(newItem)
          });
        }
      } else {
        await setDoc(cartRef, {
          items: [newItem]
        });
      }

      Alert.alert('Thành công', 'Sản phẩm đã được thêm vào giỏ hàng');
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding to cart: ", error);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng');
    }
  };

  const handleBuyNow = async () => {
    if (!user.uid) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập để mua hàng.');
      return;
    }

    const availableQuantity = product.colorImages[selectedColor]?.available_quantity || 0;
    if (quantity > availableQuantity) {
      Alert.alert('Thông báo', `Chỉ còn ${availableQuantity} sản phẩm trong kho.`);
      return;
    }

    try {
      const cartRef = doc(db, 'carts', user.uid);
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.colorImages[selectedColor]?.image || product.image,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity
      };

      await updateDoc(cartRef, {
        items: arrayUnion(newItem)
      });

      navigation.navigate('Checkout', {
        product: newItem,
        buyNow: true
      });
    } catch (error) {
      console.error("Error adding item for buy now: ", error);
      Alert.alert('Lỗi', 'Không thể thực hiện mua ngay');
    }
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

  const renderColorOption = ({ item }: any) => {
    const [color, colorData] = item;
    const isAvailable = colorData.available_quantity > 0;
    console.log(color, colorData.available_quantity);
    return (
      <TouchableOpacity
        style={[
          styles.colorOption,
          !isAvailable && styles.disabledColorOption,
          selectedColor === color && styles.selectedColorOption
        ]}
        onPress={() => {
          if (isAvailable) {
            setModalImage(colorData.image);
            setSelectedColor(color);
            setQuantity(1); // Reset quantity when changing color
          }
        }}
        disabled={!isAvailable}
      >
        <Image
          source={{ uri: colorData.image }}
          style={styles.colorOptionImage}
        />
        <View style={styles.colorOptionTextContainer}>
          <Text style={styles.colorOptionText}>{color}</Text>
          {!isAvailable && <Text style={styles.outOfStockText}>Hết hàng</Text>}
        </View>
        {selectedColor === color && (
          <Ionicons name="checkmark-circle" size={20} color="#007AFF" style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    );
  };

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

          {colorEntries.map(([color, colorData], index) => (
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
                source={{ uri: colorData.image }}
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
        <Header title='' onBackPress={handleBackPress} showCart transparent />
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

        <TouchableOpacity style={styles.buyButton} onPress={() => {
          setSelectedAddOrBuy('Buy Now');
          setModalVisible(true);
        }}>
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
                  Kho: {product.colorImages[selectedColor]?.available_quantity || 0}
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

            <View style={styles.quantitySection}>
              <Text style={styles.sectionTitle}>Số lượng</Text>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  <Ionicons name="remove" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => {
                    const availableQuantity = product.colorImages[selectedColor]?.available_quantity || 0;
                    if (quantity < availableQuantity) {
                      setQuantity(prev => prev + 1);
                    } else {
                      Alert.alert('Thông báo', `Chỉ còn ${availableQuantity} sản phẩm trong kho.`);
                    }
                  }}
                >
                  <Ionicons name="add" size={24} color="#333" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={selectedAddOrBuy === 'Add to Cart' ? handleAddToCart : handleBuyNow}
            >
              <Text style={styles.modalActionButtonText}>
                {selectedAddOrBuy === 'Add to Cart' ? 'Thêm vào giỏ hàng' : 'Mua ngay'}
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
  disabledColorOption: {
    opacity: 0.5,
  },
  selectedColorOption: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  colorOptionTextContainer: {
    flex: 1,
  },
  outOfStockText: {
    color: 'red',
    fontSize: 12,
  },
  checkIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  quantitySection: {
    marginBottom: 16,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
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

