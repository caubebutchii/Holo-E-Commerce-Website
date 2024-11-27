import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';

const CheckoutScreen = ({ navigation, route }: any) => {
  const [checkoutStage, setCheckoutStage] = useState('cart');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('visa');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [rating, setRating] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);
  const { user } = useUser();
  const [text, setText] = useState('');

  const fetchCartItems = useCallback(async () => {
    console.log('Fetching cart items for user:', user?.uid);
    if (user?.uid) {
      const cartRef = doc(db, 'carts', user.uid);
      const cartDoc = await getDoc(cartRef);

      if (cartDoc.exists()) {
        const items = cartDoc.data().items || [];
        setCartItems(items);
        setText('');
        calculateTotal(items);
      } else {
        await setDoc(cartRef, { items: [] });
        setText('Giỏ hàng trống. Đã tạo giỏ hàng mới cho bạn.');
        setCartItems([]);
      }
    } else {
      setText('Vui lòng đăng nhập để xem giỏ hàng.');
      setCartItems([]);
    }
  }, [user]);

  const calculateTotal = useCallback((items) => {
    if (!Array.isArray(items) || items.length === 0) {
      setTotal(0);
      return;
    }

    let totalAmount = 0;
    items.forEach((item) => {
      if (selectedItems.includes(item.id)) {
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
        if (prevSelectedItems.includes(item.id)) {
          return prevSelectedItems.filter((id) => id !== item.id);
        } else {
          return [...prevSelectedItems, item.id];
        }
      });
    } else {
      console.error('Invalid item or item.id is null:', item);
    }
  };

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <TouchableOpacity onPress={() => toggleSelectItem(item)}>
        <Ionicons
          name={selectedItems.includes(item.id) ? 'checkbox' : 'square-outline'}
          size={24}
          color="#007AFF"
        />
      </TouchableOpacity>
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
    </View>
  );

  const renderCart = () => (
    <FlatList
      data={cartItems}
      renderItem={renderCartItem}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={() => (
        <Text style={styles.sectionTitle}>Checkout</Text>
      )}
      
      ListFooterComponent={() => (
        <>
          <View style={styles.voucherContainer}>
            <TextInput
              style={styles.voucherInput}
              placeholder="Enter voucher code"
            />
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.total}>{text}</Text>
          <Text style={styles.total}>Total: ₫{total.toLocaleString()}</Text>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setCheckoutStage('payment')}
          >
            <Text style={styles.nextButtonText}>Next →</Text>
          </TouchableOpacity>
        </>
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
    <FlatList
      data={[]}
      renderItem={null}
      ListHeaderComponent={() => (
        <>
          <Text style={styles.sectionTitle}>Payment</Text>
          <Text style={styles.total}>TOTAL: ₫{total.toLocaleString()}</Text>
          {renderPaymentMethod('visa', 'https://example.com/visa-logo.png', '2334')}
          {renderPaymentMethod('mastercard', 'https://example.com/mastercard-logo.png', '3774')}
          {renderPaymentMethod('paypal', 'https://example.com/paypal-logo.png', 'abc@gmail.com')}
        </>
      )}
      ListFooterComponent={() => (
        <>
          <TouchableOpacity
            style={styles.payNowButton}
            onPress={() => setOrderPlaced(true)}
          >
            <Text style={styles.payNowButtonText}>Pay now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addCard}>
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.addCardText}>Add new card</Text>
          </TouchableOpacity>
        </>
      )}
    />
  );

  const renderOrderConfirmation = () => (
    <FlatList
      data={[]}
      renderItem={null}
      ListHeaderComponent={() => (
        <View style={styles.confirmationContainer}>
          <Ionicons name="checkmark-circle" size={64} color="green" />
          <Text style={styles.confirmationTitle}>Order placed successfully!</Text>
          <Text style={styles.confirmationDescription}>Commodo eu ut sunt qui minim fugiat elit nisi enim</Text>
          <View style={styles.orderSummary}>
            <Text>Subtotal</Text>
            <Text>₫{total.toLocaleString()}</Text>
          </View>
          <View style={styles.orderSummary}>
            <Text>Tax (10%)</Text>
            <Text>₫{(total * 0.1).toLocaleString()}</Text>
          </View>
          <View style={styles.orderSummary}>
            <Text>Fees</Text>
            <Text>₫0</Text>
          </View>
          <View style={styles.orderSummary}>
            <Text>Card</Text>
            <Text>****** 2334</Text>
          </View>
          <View style={styles.orderSummary}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalAmount}>₫{(total * 1.1).toLocaleString()}</Text>
          </View>
          <Text style={styles.ratingPrompt}>How was your experience?</Text>
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
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.backToHomeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );

  const renderContent = () => {
    if (orderPlaced) {
      return renderOrderConfirmation();
    }
    switch (checkoutStage) {
      case 'cart':
        return renderCart();
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
    color: '#007AFF',
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
    backgroundColor: '#007AFF',
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
    backgroundColor: '#007AFF',
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
    backgroundColor: '#007AFF',
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
    color: '#007AFF',
    fontSize: 16,
  },
  confirmationContainer: {
    alignItems: 'center',
    paddingVertical: 32,
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
    backgroundColor: '#007AFF',
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
});

export default CheckoutScreen;

