import React from 'react';
import AppNavigator from '../src/navigation/AppNavigator';
import { UserProvider } from '../src/context/UserContext';
import { LogBox } from 'react-native'; 
export default function App() {
  LogBox.ignoreLogs([ '[Reanimated] Reading from `value` during component render.', 'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead. [Component Stack]']);
  return (

    // AppNavigator sẽ được bọc trong UserProvider để sử dụng context
    // AppNavigator là children của UserProvider
    // biến user và setUser sẽ được truyền xuống cho các component con của AppNavigator
    
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}