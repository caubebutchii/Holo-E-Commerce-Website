import { getAuth, sendEmailVerification } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';

export const generateVerificationCode = () => {
  // Random ra chuỗi 6 ký tự
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hàm gửi email xác thực
export const sendVerificationCodeEmail = async (email: string, code: string) => {
  try {
    const response = await fetch('http://192.168.1.108:3000/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    throw error;
  }
};