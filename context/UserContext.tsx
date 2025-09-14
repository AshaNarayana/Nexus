
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { USERS } from '../constants';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  switchUser: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const storedUser = window.localStorage.getItem('nexus_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      window.localStorage.setItem('nexus_user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('nexus_user');
    }
  };

  const switchUser = () => {
    if (user) {
      const otherUser = USERS.find(u => u.id !== user.id);
      if (otherUser) {
        setUser(otherUser);
      }
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, switchUser }}>
      {children}
    </UserContext.Provider>
  );
};
