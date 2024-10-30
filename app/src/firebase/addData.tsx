import { useEffect, useState } from 'react';
import { app, db } from '../firebase/firebaseConfig';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Text, View } from 'react-native';



const AddProducts = ({ productsData }) => {
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
          setStatus('Documents successfully writtene!');
        } catch (e) {
          setStatus(`Error adding documents: ${e}`);
        }
      };
  
      addProducts();
    }, [productsData]);
  
    return (
        <View>
        {status && <Text>{status}</Text>}
      </View>
    );
  };
  
  export default AddProducts;
  
