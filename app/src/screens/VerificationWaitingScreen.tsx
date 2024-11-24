import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Alert, Button } from 'react-native';
import { getAuth, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { generateVerificationCode, sendVerificationCodeEmail } from '../utils/emailUtils'; // Import utility functions
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useUser } from '../context/UserContext'; // Import useUser

const VerificationWaitingScreen = ({ route, navigation }: any) => {
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { email, code } = route.params;
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useUser(); // Get setUser from context

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setIsVerified(true);
        setTimeout(() => {
          navigation.navigate('SignUp');
        }, 2000);
      }
    });

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [navigation]);

  const handleVerifyCode = async () => {
    if (inputCode === code) {
      const auth = getAuth(app);
      const db = getFirestore(app);
      const user = auth.currentUser;
      if (user) {
        try {
          const userData = {
            id: user.uid,
            name: route.params.name,
            email: user.email,
            phone: '',
          };
          await setDoc(doc(db, 'users', user.uid), userData);
          setUser(userData); // Update user context
          setIsVerified(true);
          setTimeout(() => {
            navigation.navigate('SignIn');
          }, 2000);
        } catch (error) {
          console.error('Error saving user information:', error);
        }
      }
    } else {
      setError('Mã xác thực không đúng');
    }
  };

  const handleResendEmail = async () => {
    const auth = getAuth(app);
    if (auth.currentUser) {
      try {
        const newCode = generateVerificationCode();
        setVerificationCode(newCode);
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
          <TextInput
            style={styles.input}
            placeholder="Nhập mã xác thực"
            value={inputCode}
            onChangeText={setInputCode}
          />
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
});

export default VerificationWaitingScreen;