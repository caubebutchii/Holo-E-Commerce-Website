import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, TextInput, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const CheckoutScreen = ({ navigation, route }: any) => {
  const [checkoutStage, setCheckoutStage] = useState('cart');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('visa');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [rating, setRating] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);
  const { user } = useUser();
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCartItems = useCallback(async () => {
    setIsLoading(true);
    console.log('Fetching cart items for user:', user?.uid);
    setOrderPlaced(false);
    setCheckoutStage('cart');
    if (user?.uid) {
      const cartRef = doc(db, 'carts', user.uid);
      const cartDoc = await getDoc(cartRef);

      if (cartDoc.exists()) {
        const items = cartDoc.data().items || [];
        const updatedItems = await Promise.all(items.map(async (item) => {
          const itemsRef = collection(db, 'items');
          const q = query(itemsRef, where("id", "==", item.id));
          const querySnapshot = await getDocs(q);

          const productDoc = querySnapshot.docs[0];
          if (productDoc.exists()) {
            const productData = productDoc.data();
            const availableQuantity = productData.colorImages[item.color]?.available_quantity || 0;
            const prevQuantity = item.quantity;
            if (availableQuantity === 0) {
              return { ...item, prevQuantity: prevQuantity, quantity: 0, outOfStock: true };
            } else if (item.quantity > availableQuantity && availableQuantity > 0) {
              return { ...item, quantity: availableQuantity };
            } else if (item.quantity === 0 && availableQuantity > 0) {
              if (item.prevQuantity > availableQuantity) {
                return { ...item, quantity: availableQuantity, outOfStock: false };
              } else {
                return { ...item, quantity: 1, outOfStock: false };
              }
            }
          } else {
            console.log('Product not found:', item.id, typeof item.id);
            console.log('Product Ref: ', item.productRef, typeof item.productRef);
          }
          return item;
        }));

        await updateDoc(cartRef, { items: updatedItems });
        const inStockItems = updatedItems.filter(item => item.quantity > 0);
        const outOfStockItems = updatedItems.filter(item => item.quantity === 0);
        setCartItems(inStockItems);
        console.log('danh sach san pham trong gio hang', cartItems)
        cartItems.forEach(item => {
        
          console.log(item)
        })
        setOutOfStockItems(outOfStockItems);
        calculateTotal(inStockItems);
      } else {
        await setDoc(cartRef, { items: [] });
        setCartItems([]);
        setOutOfStockItems([]);
      }
    } else {
      setCartItems([]);
      setOutOfStockItems([]);
    }
    setIsLoading(false);
  }, [user, calculateTotal]);

  const calculateTotal = useCallback((items) => {
    if (!Array.isArray(items) || items.length === 0) {
      setTotal(0);
      return;
    }

    let totalAmount = 0;
    items.forEach((item) => {
      if (selectedItems.includes(`${item.id}-${item.color}`)) {
        totalAmount += item.price * item.quantity;
      }
    });
    setTotal(totalAmount);
  }, [selectedItems]);

  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
    }, [fetchCartItems])
  );

  useEffect(() => {
    if (route.params?.buyNow) {
      const { product } = route.params;
      addBuyNowItemToCart(product);
    }
  }, []);

  useEffect(() => {
    calculateTotal(cartItems);
  }, [selectedItems, cartItems, calculateTotal]);

  const addBuyNowItemToCart = async (product) => {
    if (!user?.uid) {
      Alert.alert('Error', 'Please log in to add items to cart');
      return;
    }

    try {
      const cartRef = doc(db, 'carts', user.uid);
      await updateDoc(cartRef, {
        items: arrayUnion(product)
      });
      fetchCartItems();
    } catch (error) {
      console.error("Error adding buy now item to cart: ", error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const toggleSelectItem = (item) => {
    if (item && item.id) {
      setSelectedItems((prevSelectedItems) => {
        const itemKey = `${item.id}-${item.color}`;
        if (prevSelectedItems.includes(itemKey)) {
          return prevSelectedItems.filter((key) => key !== itemKey);
        } else {
          return [...prevSelectedItems, itemKey];
        }
      });
    } else {
      console.error('Invalid item or item.id is null:', item);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => `${item.id}-${item.color}`));
    }
  };

  const removeItemFromCart = async (item) => {
    if (!user?.uid) {
      Alert.alert('Error', 'Please log in to remove items from cart');
      return;
    }

    try {
      const cartRef = doc(db, 'carts', user.uid);
      const cartDoc = await getDoc(cartRef);

      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const updatedItems = cartData.items.filter(
          (cartItem) => !(cartItem.id === item.id && cartItem.color === item.color)
        );
        await updateDoc(cartRef, { items: updatedItems });
        fetchCartItems();
      }
    } catch (error) {
      console.error("Error removing item from cart: ", error);
      Alert.alert('Error', 'Failed to remove item from cart');
    }
  };

  const placeOrder = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một sản phẩm để đặt hàng.');
      return;
    }

    setIsLoading(true);
    Alert.alert(
      'Xác nhận đặt hàng',
      'Bạn có chắc chắn muốn đặt hàng?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Đồng ý',
          onPress: async () => {
            try {
              // Lưu đơn hàng vào collection 'orders'
              const orderRef = await addDoc(collection(db, 'orders'), {
                userId: user.uid,
                items: cartItems.filter(item => selectedItems.includes(`${item.id}-${item.color}`)),
                total: total,
                paymentMethod: selectedPaymentMethod,
                createdAt: serverTimestamp()
              });
              const itemsRef = collection(db, 'items');
              

              // Cập nhật số lượng sản phẩm trong 'items'
              for (const item of cartItems) {
                if (selectedItems.includes(`${item.id}-${item.color}`)) {
                  const itemRef = doc(db, 'items', item.productRef);
                  // lấy ra item bằng id chứ ko bằng productRef nữa
                  const q = query(itemsRef, where("id", "==", item.id));
                  const querySnapshot = await getDocs(q);

                  const itemDoc = querySnapshot.docs[0];
                  if (itemDoc.exists()) {
                    const itemData = itemDoc.data();
                    const availableQuantity = itemData.colorImages[item.color]?.available_quantity || 0;
                    const newQuantity = availableQuantity - item.quantity;
                    await updateDoc(itemRef, {
                      [`colorImages.${item.color}.available_quantity`]: newQuantity
                    });
                  }
                  else
                  {
                    console.log('Product not found:', item.id, typeof item.id);
                    console.log('Product Ref: ', item.productRef, typeof item.productRef);
                    Alert.alert('Lỗi', 'Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại sau.');
                  }
                }
              }

              // Xóa các item đã mua khỏi giỏ hàng
              const cartRef = doc(db, 'carts', user.uid);
              const updatedCartItems = cartItems.filter(item => !selectedItems.includes(`${item.id}-${item.color}`));
              await updateDoc(cartRef, { items: updatedCartItems });

              setOrderPlaced(true);
              setCheckoutStage('confirmation');
            } catch (error) {
              console.error("Error placing order: ", error);
              Alert.alert('Lỗi', 'Không thể đặt hàng. Vui lòng thử lại sau.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      {!item.outOfStock && (
        <TouchableOpacity onPress={() => toggleSelectItem(item)}>
          <Ionicons
            name={selectedItems.includes(`${item.id}-${item.color}`) ? 'checkbox' : 'square-outline'}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
      )}
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
        <Text style={styles.productVariant}>
          {item.color && `Màu ${item.color}`}
          {item.color && item.size && ' - '}
          {item.size && `Size ${item.size}`}
        </Text>
        <View style={styles.priceQuantityContainer}>
          <Text style={styles.productPrice}>₫{item.price.toLocaleString()}</Text>
          <Text style={styles.productQuantity}>x{item.quantity}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => {
        Alert.alert(
          'Xóa sản phẩm',
          'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
          [
            {
              text: 'Hủy',
              style: 'cancel'
            },
            {
              text: 'Xóa',
              onPress: () => removeItemFromCart(item)
            }
          ]
        );
      }}>
        <Ionicons name="close-circle" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  const renderCart = () => (
    <FlatList
      data={[{ key: 'header' }, ...cartItems, { key: 'footer' }]}
      renderItem={({ item }) => {
        if (item.key === 'header') {
          return (
            <>
              <Text style={styles.sectionTitle}>Giỏ hàng</Text>
              {user?.uid && (
                <TouchableOpacity style={styles.selectAllButton} onPress={toggleSelectAll}>
                  <Ionicons
                    name={selectedItems.length === cartItems.length ? 'checkbox' : 'square-outline'}
                    size={24}
                    color="#007AFF"
                  />
                  <Text style={styles.selectAllText}>Chọn tất cả</Text>
                </TouchableOpacity>
              )}
            </>
          );
        }
        if (item.key === 'footer') {
          return (
            <>
              {outOfStockItems.length > 0 && (
                <View style={styles.outOfStockContainer}>
                  <TouchableOpacity 
                    style={styles.outOfStockHeader} 
                    onPress={() => setShowOutOfStock(!showOutOfStock)}
                  >
                    <Text style={styles.outOfStockTitle}>Sản phẩm hết hàng ({outOfStockItems.length})</Text>
                    <Ionicons 
                      name={showOutOfStock ? 'chevron-up' : 'chevron-down'} 
                      size={24} 
                      color="#333"
                    />
                  </TouchableOpacity>
                  {showOutOfStock && (
                    <FlatList
                      data={outOfStockItems}
                      renderItem={renderCartItem}
                      keyExtractor={(item, index) => `outofstock-${item.id}-${item.color}-${index}`}
                    />
                  )}
                </View>
              )}
            </>
          );
        }
        return renderCartItem({ item });
      }}
      keyExtractor={(item, index) => 
        item.key ? item.key : `${item.id}-${item.color}-${index}`
      }
      ListEmptyComponent={() => (
        <Text style={styles.loginMessage}>
          {user?.uid ? 'Giỏ hàng của bạn đang trống.' : 'Vui lòng đăng nhập để xem giỏ hàng của bạn.'}
        </Text>
      )}
    />
  );

  const renderPaymentMethod = (method, logo, lastDigits) => (
    <TouchableOpacity
      style={[
        styles.paymentMethod,
        selectedPaymentMethod === method && styles.selectedPaymentMethod,
      ]}
      onPress={() => setSelectedPaymentMethod(method)}
    >
      <Ionicons
        name={selectedPaymentMethod === method ? 'radio-button-on' : 'radio-button-off'}
        size={24}
        color="#007AFF"
      />
      <Image source={{ uri: logo }} style={styles.paymentLogo} />
      <Text style={styles.paymentText}>****** {lastDigits}</Text>
    </TouchableOpacity>
  );

  const renderPayment = () => (
    <View style={styles.paymentContainer}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Thanh toán</Text>
        <Text style={styles.total}>TỔNG CỘNG: ₫{total.toLocaleString()}</Text>
        {renderPaymentMethod('visa', 'https://example.com/visa-logo.png', '2334')}
        {renderPaymentMethod('mastercard', 'https://example.com/mastercard-logo.png', '3774')}
        {renderPaymentMethod('paypal', 'https://example.com/paypal-logo.png', 'abc@gmail.com')}
        <TouchableOpacity
          style={styles.payNowButton}
          onPress={placeOrder}
        >
          <Text style={styles.payNowButtonText}>Thanh toán ngay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addCard}>
          <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
          <Text style={styles.addCardText}>Thêm thẻ mới</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCheckoutStage('cart')}
        >
          <Text style={styles.backButtonText}>← Quay lại giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOrderConfirmation = () => (
    <ScrollView contentContainerStyle={styles.confirmationContainer}>
      <Ionicons name="checkmark-circle" size={64} color="green" />
      <Text style={styles.confirmationTitle}>Đặt hàng thành công!</Text>
      <Text style={styles.confirmationDescription}>Cảm ơn bạn đã mua hàng!</Text>
      <View style={styles.orderSummary}>
        <Text>Tổng tiền hàng</Text>
        <Text>₫{total.toLocaleString()}</Text>
      </View>
      <View style={styles.orderSummary}>
        <Text>Thuế (10%)</Text>
        <Text>₫{(total * 0.1).toLocaleString()}</Text>
      </View>
      <View style={styles.orderSummary}>
        <Text>Phí vận chuyển</Text>
        <Text>₫0</Text>
      </View>
      <View style={styles.orderSummary}>
        <Text>Phương thức thanh toán</Text>
        <Text>{selectedPaymentMethod === 'visa' ? 'Visa ******2334' : 
               selectedPaymentMethod === 'mastercard' ? 'Mastercard ******3774' : 
               'PayPal abc@gmail.com'}</Text>
      </View>
      <View style={styles.orderSummary}>
        <Text style={styles.totalText}>Tổng cộng</Text>
        <Text style={styles.totalAmount}>₫{(total * 1.1).toLocaleString()}</Text>
      </View>
      <Text style={styles.ratingPrompt}>Bạn đánh giá trải nghiệm mua hàng như thế nào?</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={32}
              color={star <= rating ? '#FFD700' : '#C0C0C0'}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.backToHomeButton}
        onPress={() => {
          setOrderPlaced(false);
          setCheckoutStage('cart');
          navigation.navigate('Home')}}
      >
        <Text style={styles.backToHomeButtonText}>Quay về trang chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={!orderPlaced ? styles.backButton : styles.backToPaymentAfterOrder}
        onPress={() => {
          if(!orderPlaced)
            setCheckoutStage('payment')
          
        }}
      >
        <Text style={styles.backButtonText}>← Quay lại thanh toán</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3B30" />
        </View>
      );
    }
    if (orderPlaced) {
      return renderOrderConfirmation();
    }
    switch (checkoutStage) {
      case 'cart':
        return (
          <View style={styles.cartContainer}>
            {renderCart()}
            {user?.uid && (
              <View style={styles.fixedBottomContainer}>
                <View style={styles.voucherContainer}>
                  <TextInput
                    style={styles.voucherInput}
                    placeholder="Nhập mã giảm giá"
                  />
                  <TouchableOpacity style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Áp dụng</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.total}>Tổng cộng: ₫{total.toLocaleString()}</Text>
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={() => {
                    if (selectedItems.length === 0) {
                      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một sản phẩm để đặt hàng.');
                    } else {
                      setCheckoutStage('payment');
                    }
                  }}
                >
                  <Text style={styles.nextButtonText}>Đặt hàng →</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      case 'payment':
        return renderPayment();
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={['#E6F3FF', '#FFFFFF']} style={styles.container}>
      {renderContent()}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cartContainer: {
    flex: 1,
  },
  paymentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productVariant: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0dd7df',
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
  },
  voucherContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  voucherInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  applyButton: {
    backgroundColor: '#0dd7df',
    padding: 8,
    borderRadius: 4,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  total: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#0dd7df',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectedPaymentMethod: {
    borderColor: '#007AFF',
    backgroundColor: '#E6F2FF',
  },
  paymentLogo: {
    width: 40,
    height: 24,
    marginLeft: 12,
    marginRight: 8,
  },
  paymentText: {
    flex: 1,
    color: '#333',
  },
  payNowButton: {
    backgroundColor: '#0dd7df',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  payNowButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  addCardText: {
    marginLeft: 8,
    color: '#0dd7df',
    fontSize: 16,
  },
  confirmationContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
  },
  confirmationDescription: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  totalText: {
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: 'green',
  },
  ratingPrompt: {
    fontSize: 18,
    marginTop: 24,
    marginBottom: 8,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  backToHomeButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  backToHomeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  outOfStockText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    marginTop: 4,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectAllText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#0dd7df',
  },
  outOfStockContainer: {
    marginTop: 16,
  },
  outOfStockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  outOfStockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bottomContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom:45
  },
  fixedBottomContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 55,
    left: 0,
    right: 0,
  },
  loginMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#0dd7df',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToPaymentAfterOrder:
  {
    // cho btn ẩn đi
    display: 'none'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CheckoutScreen;

