import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { useUser } from '../context/UserContext';

const AccountScreen = ({ navigation }: any) => {
  const { user, setUser } = useUser();
  const auth = getAuth(app);
  const [userName, setUserName] = useState('Bạn chưa đăng nhập');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (user.uid) {
      setUserName(user.name);
      setIsLoggedIn(true);
    } else {
      setUserName('Bạn chưa đăng nhập');
      setIsLoggedIn(false);
    }
  }, [user]);

  const handleSignOut = async () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await signOut(auth);
              setUser({ uid: '', name: '', email: '', phone: '', address: '' });
              setIsLoggedIn(false);
            } catch (error) {
              console.error('Error signing out: ', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleItemPress = (item) => {
    if (item.screen && !isLoggedIn) {
      Alert.alert('Thông báo', 'Bạn chưa đăng nhập');
    } else if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{userName}</Text>
        </View>

        {[
          { label: 'Cập nhật thông tin', icon: 'person-outline', screen: 'UpdateProfile' },
          { label: 'Thay đổi mật khẩu', icon: 'lock-closed-outline', screen: 'ChangePassword' },
          { label: 'Xem đơn mua', icon: 'list-outline', screen: 'OrderList' },
          { label: 'Về ứng dụng', icon: 'information-circle-outline' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleItemPress(item)}
          >
            <Ionicons name={item.icon} size={24} color="#4CAF50" />
            <Text style={styles.menuItemText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={24} color="#777" />
          </TouchableOpacity>
        ))}

        {isLoggedIn ? (
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.authButtonsContainer}>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={styles.authButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.authButtonText}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 20,
  },
  logoutButton: {
    margin: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  authButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccountScreen;

