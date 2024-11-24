// Đây là file để tạo ra một context chứa thông tin của user, và cung cấp hàm để cập nhật thông tin user.
// sử dụng hook useContext để lấy thông tin user từ context, và cung cấp thông tin user cho các component con.


import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

// Ban đầu thì user sẽ là một object gồm các field giá trị ''
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    uid: '',
    name: '',
    email: '',
    phone: ''
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);