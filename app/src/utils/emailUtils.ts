import { getAuth, sendEmailVerification } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';

export const generateVerificationCode = () => {
  // Random ra chuỗi 6 ký tự
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hàm gửi email xác thực
export const sendVerificationCodeEmail = async (email: string, code: string) => {
  const auth = getAuth(app);
  // Lấy user hiện tại
  const user = auth.currentUser;
  if (user) {
    try {
      const emailContent = `Mã xác thực của bạn là: ${code}`;
      await sendEmailVerification(user, {
        // Gửi email xác thực với nội dung là link đến trang verify với mã xác thực
        handleCodeInApp: false,
        // Tạo content email
        emailContent: emailContent
      });
    } catch (error) {
      throw error;
    }
  }
};