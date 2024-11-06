import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';

const PhoneSignUpScreen = ({ navigation, route }) => {
  const { returnTo } = route.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSendCode = async () => {
    try {
      const auth = getAuth(app);
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(phoneNumber, 60);
      setVerificationId(verificationId);
      setIsCodeSent(true);
      Alert.alert('Thành công', 'Mã xác thực đã được gửi đến số điện thoại của bạn');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi mã xác thực. Vui lòng thử lại.');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const auth = getAuth(app);
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await signInWithCredential(auth, credential);
      navigation.navigate(returnTo.screen, returnTo.params);
    } catch (error) {
      Alert.alert('Lỗi', 'Mã xác thực không đúng. Vui lòng thử lại.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Đăng ký bằng số điện thoại</Text>
        <Text style={styles.subtitle}>Nhập số điện thoại để nhận mã xác thực</Text>
      </View>

      <View style={styles.form}>
        {!isCodeSent ? (
          <>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
            <TouchableOpacity 
              style={styles.button}
              onPress={handleSendCode}
            >
              <Text style={styles.buttonText}>Gửi mã xác thực</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mã xác thực"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
              />
            </View>
            <TouchableOpacity 
              style={styles.button}
              onPress={handleVerifyCode}
            >
              <Text style={styles.buttonText}>Xác thực</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 16,
  },
  button: {
    backgroundColor: '#00BDD6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PhoneSignUpScreen;