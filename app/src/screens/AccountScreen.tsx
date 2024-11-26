import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useUser } from '../context/UserContext';

const AccountScreen = ({ navigation }: any) => {
  // Lấy thông tin user từ context
  const { user, setUser } = useUser();
  // Lấy auth từ firebase
  // auth là một object chứa các method để thực hiện các thao tác liên quan đến authentication
  const auth = getAuth(app);
  // Tạo state để lưu tên của user
  const [userName, setUserName] = useState('');

  // Lấy thông tin user từ firestore và set vào state khi user thay đổi
  useEffect(() => {
    // check xem user có tồn tại không
    if(user.uid == ''){
      // nếu không tồn tại thì chuyển về welcome screen
      navigation.navigate('Welcome');
      return;
    }
    else
    {
      // nếu tồn tại thì lấy thông tin user từ context và set vào state
      setUserName(user.name);
    }
  }, [user, setUser]);

  const handleSignOut = async () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.replace('Welcome');
            } catch (error) {
              console.error('Error signing out: ', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
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
          { label: 'Ngôn ngữ', icon: 'globe-outline' },
          { label: 'Về ứng dụng', icon: 'information-circle-outline' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            // tryền screen vào navigation.navigate
            onPress={() => item.screen && navigation.navigate(item.screen)}
          >
            // sử dụng icon từ Ionicons
            <Ionicons name={item.icon} size={24} color="#4CAF50" />
            <Text style={styles.menuItemText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={24} color="#777" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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
});

export default AccountScreen;
