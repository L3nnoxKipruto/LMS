import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { dbGetUsers, dbAddUser, initMockDatabase, dbGetAnalytics } from '../mock-db/db';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<User>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Seed and prepare local storage mock database
    initMockDatabase();

    // Check if session exists in localStorage
    const savedUser = localStorage.getItem('jh_user');
    const savedToken = localStorage.getItem('jh_token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    try {
      const users = dbGetUsers();
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      const access = `mock-access-token-${Date.now()}`;
      const refresh = `mock-refresh-token-${Date.now()}`;
      
      const mappedUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        avatarUrl: foundUser.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${foundUser.email}`,
        institution: foundUser.institution || 'Naserian TVET Institute',
        department: foundUser.department
      };

      localStorage.setItem('jh_user', JSON.stringify(mappedUser));
      localStorage.setItem('jh_token', access);
      localStorage.setItem('jh_refresh_token', refresh);

      setUser(mappedUser);
      setToken(access);
      setIsLoading(false);
      return mappedUser;
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    try {
      const users = dbGetUsers();
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      
      if (existing) {
        throw new Error('This email is already registered.');
      }

      const newUser: User & { password?: string } = {
        id: `u_${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
        institution: 'Naserian TVET Institute',
        department: role === 'lecturer' ? 'Electrical Engineering' : role === 'admin' ? 'Main Classroom Host 1' : 'Software Development'
      };

      dbAddUser(newUser);

      const access = `mock-access-token-${Date.now()}`;
      const refresh = `mock-refresh-token-${Date.now()}`;
      
      localStorage.setItem('jh_user', JSON.stringify(newUser));
      localStorage.setItem('jh_token', access);
      localStorage.setItem('jh_refresh_token', refresh);

      // Initialize default analytics for student account
      if (role === 'student') {
        dbGetAnalytics(newUser.id);
      }

      setUser(newUser);
      setToken(access);
      setIsLoading(false);
      return newUser;
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('jh_user');
    localStorage.removeItem('jh_token');
    localStorage.removeItem('jh_refresh_token');
    setUser(null);
    setToken(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updatedUser = { ...user, role: newRole };
    localStorage.setItem('jh_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
