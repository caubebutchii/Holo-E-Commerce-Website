import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable
} from 'react-native';
import { X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const SplashAd = ({ onClose, onPress, imageUri,navigation }: any) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    try {
      const hasShown = await AsyncStorage.getItem('splashAdShown');
      if (!hasShown) {
        setVisible(true);
        await AsyncStorage.setItem('splashAdShown', 'true');
      } else {
        // Nếu đã hiển thị, không cần làm gì
        setVisible(false);
      }
    } catch (error) {
      console.error('Error checking first time:', error);
    }
  };

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  const handlePress = () => {
    setVisible(false);
    onPress();
  };

  // Reset trạng thái khi ứng dụng được mở lại
  const resetSplashAd = async () => {
    await AsyncStorage.removeItem('splashAdShown');
    checkFirstTime();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', resetSplashAd);
    return unsubscribe;
  }, [navigation]);

  if (!visible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose} accessibilityLabel="Close advertisement">
            <X size={24} color="#000" />
          </TouchableOpacity>
          
          <Pressable style={styles.imageContainer} onPress={handlePress}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
              accessibilityLabel="Advertisement image"
            />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default SplashAd;