import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getFirestore, collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useUser } from '../../context/UserContext';
import { db } from '@/src/firebase/firebaseConfig';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  showCart?: boolean;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, onBackPress, showCart, transparent }) => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [cartItemCount, setCartItemCount] = useState(0);

  // useEffect(() => {
  //   if (user && user.uid) {
  //     const db = getFirestore();
  //     const cartRef = collection(db, 'carts');
  //     const userCartQuery = query(cartRef, where('userId', '==', user.uid));

  //     const unsubscribe = onSnapshot(userCartQuery, (snapshot) => {
  //       if (!snapshot.empty) {
  //         const cartDoc = snapshot.docs[0];
  //         const cartData = cartDoc.data();
  //         if (cartData && cartData.items) {
  //           setCartItemCount(cartData.items.length);
  //         }
  //       } else {
  //         setCartItemCount(0);
  //       }
  //     });

  //     return () => unsubscribe();
  //   }
  // }, [user]);
  const fetchCartItems = useCallback(async () => {
    console.log('Fetching cart items for user in header:', user?.uid);
    if (user?.uid) {
      const cartRef = doc(db, 'carts', user.uid);
      const cartDoc = await getDoc(cartRef);

      if (cartDoc.exists()) {
        const items = cartDoc.data().items || [];
        setCartItemCount(items.length);
      } else {
        setCartItemCount(0);
      }
    }
  }, [user]);
  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
    }, [fetchCartItems])
  );
  return (
    <LinearGradient
      colors={transparent ? ['rgba(249, 248, 247, 0.001)', 'rgba(249, 248, 247, 0.001)'] : ['#dcf1f9', '#dcf1f9']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#323660" />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, transparent && styles.transparentTitle]}>{title}</Text>
        {showCart && (
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('Checkout')}
          >
            <Ionicons name="cart-outline" size={24} color={transparent ? "#1e1eed" : "#323660"} />
            {cartItemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingTop: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#323660',
  },
  transparentTitle: {
    color: '#000000',
  },
  backButton: {
    padding: 8,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;