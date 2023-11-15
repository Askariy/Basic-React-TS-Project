import React, { useState, useContext, createContext, useEffect } from 'react';

interface User {
  isAuthenticated: boolean;
  token: string | null;
  data: Record<string, any>;
}

interface AuthContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

interface Props {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuthContext = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const initData: User = JSON.parse(
    localStorage.getItem('user') || 'null'
  ) || {
    isAuthenticated: false,
    token: null,
    data: {},
  };
  const [user, setUser] = useState<User>(initData);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
