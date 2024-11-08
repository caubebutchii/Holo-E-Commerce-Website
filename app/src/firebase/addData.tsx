import { useEffect, useState } from 'react';
import { app, db } from '../firebase/firebaseConfig';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Text, View } from 'react-native';

const AddProducts = ({ productsData, onComplete }) => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const addProducts = async () => {
      const batch = writeBatch(db);
      try {
        productsData.forEach((product) => {
          const productRef = doc(collection(db, 'items'));
          batch.set(productRef, product);
        });
        await batch.commit();
        setStatus('Documents successfully written!');
        onComplete(); // Gọi callback khi hoàn thành
      } catch (e) {
        setStatus(`Error adding documents: ${e}`);
      }
    };

    if (productsData && productsData.length > 0) {
      addProducts();
    }
  }, [productsData, onComplete]);

  return (
    <View>
      {status && <Text>{status}</Text>}
    </View>
  );
};

export default AddProducts;