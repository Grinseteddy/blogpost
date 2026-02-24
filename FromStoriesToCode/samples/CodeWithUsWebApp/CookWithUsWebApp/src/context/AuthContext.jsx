import { createContext } from 'react';

export const AuthContext = createContext({
  cook: null,
  login: () => {},
  logout: () => {},
});
