import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Alert, Button } from 'react-native';
import { getAuth, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { generateVerificationCode, sendVerificationCodeEmail } from '../utils/emailUtils'; // Import utility functions
import { useUser } from '../context/UserContext'; // Import useUser
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const VerificationWaitingScreen = ({ route, navigation }: any) => {
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { email, code, name, password } = route.params;
  const [inputCode, setInputCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const { setUser } = useUser(); // Get setUser from context

  useEffect(() => {
    const auth = getAuth(app);
    // Kiểm tra xem user đã xác thực email chưa
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setIsVerified(true);
        // Nếu đã xác thực email thì chuyển hướng đến trang đăng nhập
        setTimeout(() => {
          navigation.navigate('SignIn');
        }, 2000);
      }
    });

    // function này thực hiện việc giảm countdown mỗi giây
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    // function này sẽ được gọi khi component unmount
    // thực hiện việc unsubscribe listener và clear interval
    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [navigation]);

  const handleVerifyCode = async () => {
    if (inputCode.join('') === code) {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (user) {
        try {
          const db = getFirestore(app);
          const userData = {
            id: user.uid,
            name,
            email,
            phone: '',
          };
          await setDoc(doc(db, 'users', user.uid), userData);
          setUser(userData);
          navigation.navigate('Main');
        } catch (error) {
          console.error('Error saving user data:', error);
          setError('Có lỗi xảy ra khi lưu thông tin người dùng');
        }
      } else {
        setError('Không tìm thấy thông tin người dùng');
      }
    } else {
      setError('Mã xác thực không đúng');
    }
  };

  const handleInputChange = (index, value) => {
    const newInputCode = [...inputCode];
    newInputCode[index] = value;
    setInputCode(newInputCode);
  };

  const handleResendEmail = async () => {
    const auth = getAuth(app);
    if (auth.currentUser) {
      try {
        const newCode = generateVerificationCode();
        setInputCode('');
        await sendVerificationCodeEmail(email, newCode);
        setCountdown(60);
      } catch (error) {
        console.error('Error resending verification email:', error);
      }
    }
  };

  const handleOk = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực Email</Text>
      <Text style={styles.message}>
        Chúng tôi đã gửi mã xác thực đến {email}. Vui lòng kiểm tra hộp thư của bạn và nhập mã xác thực.
      </Text>
      {isVerified ? (
        <View>
          <Text style={styles.successMessage}>Email đã được xác thực!</Text>
          <Button title="OK" onPress={handleOk} />
        </View>
      ) : (
        <View>
          <View style={styles.codeInputContainer}>
            {inputCode.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.codeInput}
                value={digit}
                onChangeText={(value) => handleInputChange(index, value)}
                keyboardType="numeric"
                maxLength={1}
              />
            ))}
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyCode}>
            <Text style={styles.verifyButtonText}>Xác thực</Text>
          </TouchableOpacity>
          <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
          <TouchableOpacity 
            style={[styles.resendButton, countdown > 0 && styles.disabledButton]} 
            onPress={handleResendEmail}
            disabled={countdown > 0}
          >
            <Text style={styles.resendButtonText}>
              {countdown > 0 ? `Gửi lại mã xác thực (${countdown}s)` : 'Gửi lại mã xác thực'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  loader: {
    marginBottom: 20,
  },
  successMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  resendButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  resendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
    width: 40,
  },
});

export default VerificationWaitingScreen;

