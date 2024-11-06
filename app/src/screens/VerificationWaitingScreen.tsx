import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getAuth, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';

const VerificationWaitingScreen = ({ route, navigation }: any) => {
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { email } = route.params;

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

  const handleResendEmail = async () => {
    const auth = getAuth(app);
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setCountdown(60);
      } catch (error) {
        console.error('Error resending verification email:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực Email</Text>
      <Text style={styles.message}>
        Chúng tôi đã gửi email xác thực đến {email}. Vui lòng kiểm tra hộp thư của bạn và nhấp vào liên kết xác thực.
      </Text>
      {isVerified ? (
        <View>
          <Text style={styles.successMessage}>Email đã được xác thực!</Text>
          <Text>Đang chuyển hướng...</Text>
        </View>
      ) : (
        <View>
          <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
          <TouchableOpacity 
            style={[styles.resendButton, countdown > 0 && styles.disabledButton]} 
            onPress={handleResendEmail}
            disabled={countdown > 0}
          >
            <Text style={styles.resendButtonText}>
              {countdown > 0 ? `Gửi lại email xác thực (${countdown}s)` : 'Gửi lại email xác thực'}
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
});

export default VerificationWaitingScreen;