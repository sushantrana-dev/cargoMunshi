import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initially no user is authenticated

  const login = (userCredentials) => {
    // Implement login logic here, potentially validating with a backend
    setUser(userCredentials); // Mocked user object
  };

  const logout = () => {
    setUser(null); // Remove user from context
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);