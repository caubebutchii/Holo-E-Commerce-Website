import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useUser } from '../context/UserContext';

const AccountScreen = ({ navigation }: any) => {
  const { user, setUser } = useUser();
  const auth = getAuth(app);

  useEffect(() => {
    const fetchUserData = async (user) => {
      const db = getFirestore(app);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    };

    if (user && user.uid) {
      fetchUserData(user);
    } else {
      navigation.replace('Welcome');
    }
  }, [navigation, user, setUser]);

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

  const handleUpdateProfile = async (updatedData) => {
    const db = getFirestore(app);
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDocRef, updatedData);
      setUser({ ...user, ...updatedData }); // Update user context
    } catch (error) {
      console.error('Error updating profile: ', error);
    }
  };

  const handleChangePassword = async (newPassword) => {
    const auth = getAuth(app);
    try {
      await auth.currentUser.updatePassword(newPassword);
      Alert.alert('Thành công', 'Mật khẩu đã được thay đổi');
    } catch (error) {
      console.error('Error changing password: ', error);
    }
  };

  if (!user) {
    return null; // Return null to avoid rendering anything if user is not logged in
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{user.name}</Text>
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
            onPress={() => item.screen && navigation.navigate(item.screen)}
          >
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
