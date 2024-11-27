import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig';

const UserContext = createContext({
  user: {
    uid: '',
    name: '',
    email: '',
    phone: ''
  },
  setUser: (user: any) => {}
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    uid: '',
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const db = getFirestore(app);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || ''
          });
        }
      } else {
        setUser({
          uid: '',
          name: '',
          email: '',
          phone: ''
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

