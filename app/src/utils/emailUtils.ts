import { getAuth, sendEmailVerification } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationCodeEmail = async (email: string, code: string) => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (user) {
    try {
      await sendEmailVerification(user, {
        url: `https://your-app-url.com/verify?code=${code}`,
        handleCodeInApp: true,
      });
    } catch (error) {
      throw error;
    }
  }
};