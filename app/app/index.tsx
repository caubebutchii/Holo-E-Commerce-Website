import React from 'react';
import AppNavigator from '../src/navigation/AppNavigator';
import { UserProvider } from '../src/context/UserContext';

export default function App() {
  return (

    // AppNavigator sẽ được bọc trong UserProvider để sử dụng context
    // AppNavigator là children của UserProvider
    // biến user và setUser sẽ được truyền xuống cho các component con của AppNavigator
    
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}