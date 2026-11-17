import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { initialPayouts, initialPromos, notifications as initialNotifications } from './data.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState({ name: 'Dea Jola', email: 'dea.jola@exp.com', role: 'superAdmin' });
  const [payouts, setPayouts] = useState(initialPayouts);
  const [promos, setPromos] = useState(initialPromos);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toast, setToast] = useState(null);
  const timer = useRef();

  const notify = useCallback((message) => {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const value = useMemo(
    () => ({ user, setUser, payouts, setPayouts, promos, setPromos, notifications, setNotifications, toast, notify }),
    [user, payouts, promos, notifications, toast, notify],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
