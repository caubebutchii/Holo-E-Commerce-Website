import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CheckoutScreen = ({ navigation }) => {
  const [checkoutStage, setCheckoutStage] = useState('cart');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('visa');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [rating, setRating] = useState(0);

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
      <Text style={styles.productQuantity}>x{item.quantity}</Text>
    </View>
  );

  const renderCart = () => (
    <ScrollView>
      <Text style={styles.sectionTitle}>Checkout</Text>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.voucherContainer}>
        <TextInput
          style={styles.voucherInput}
          placeholder="Enter voucher code"
        />
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.total}>TOTAL: $2,800</Text>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setCheckoutStage('payment')}
      >
        <Text style={styles.nextButtonText}>Next →</Text>
      </TouchableOpacity>
    </ScrollView>
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
    <ScrollView>
      <Text style={styles.sectionTitle}>Payment</Text>
      <Text style={styles.total}>TOTAL: $3,080</Text>
      {renderPaymentMethod('visa', 'https://example.com/visa-logo.png', '2334')}
      {renderPaymentMethod('mastercard', 'https://example.com/mastercard-logo.png', '3774')}
      {renderPaymentMethod('paypal', 'https://example.com/paypal-logo.png', 'abc@gmail.com')}
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
    </ScrollView>
  );

  const renderOrderConfirmation = () => (
    <ScrollView contentContainerStyle={styles.confirmationContainer}>
      <Ionicons name="checkmark-circle" size={64} color="green" />
      <Text style={styles.confirmationTitle}>Order placed successfully!</Text>
      <Text style={styles.confirmationDescription}>Commodo eu ut sunt qui minim fugiat elit nisi enim</Text>
      <View style={styles.orderSummary}>
        <Text>Subtotal</Text>
        <Text>$2,800</Text>
      </View>
      <View style={styles.orderSummary}>
        <Text>Tax (10%)</Text>
        <Text>$280</Text>
      </View>
      <View style={styles.orderSummary}>
        <Text>Fees</Text>
        <Text>$0</Text>
      </View>
      <View style={styles.orderSummary}>
        <Text>Card</Text>
        <Text>****** 2334</Text>
      </View>
      <View style={styles.orderSummary}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalAmount}>$3,080</Text>
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
    </ScrollView>
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

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: 'gray',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  productQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
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
  },
  confirmationDescription: {
    textAlign: 'center',
    marginBottom: 24,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  totalText: {
    fontWeight: 'bold',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: 'green',
  },
  ratingPrompt: {
    fontSize: 18,
    marginTop: 24,
    marginBottom: 8,
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

const cartItems = [
  {
    name: 'Headphone',
    description: 'Consequat ex eu',
    price: 500,
    quantity: 1,
    image: 'https://example.com/headphone1.jpg',
  },
  {
    name: 'Headphone',
    description: 'Consequat ex eu',
    price: 300,
    quantity: 1,
    image: 'https://example.com/headphone2.jpg',
  },
  {
    name: 'Smartphone',
    description: 'Consequat ex eu',
    price: 1000,
    quantity: 1,
    image: 'https://example.com/smartphone1.jpg',
  },
  {
    name: 'Smartphone',
    description: 'Consequat ex eu',
    price: 1000,
    quantity: 1,
    image: 'https://example.com/smartphone2.jpg',
  },
];

export default CheckoutScreen;