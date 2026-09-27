import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserRole } from '../data/types';

interface AppState {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('maha_pramaan_role') ?? localStorage.getItem('regulaone_role');
    return saved as UserRole | null;
  });
  // The sidebar is fixed on desktop and starts closed on small screens.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSetRole = (newRole: UserRole | null) => {
    setRole(newRole);
    if (newRole) {
      localStorage.setItem('maha_pramaan_role', newRole);
      localStorage.removeItem('regulaone_role');
    } else {
      localStorage.removeItem('regulaone_role');
      localStorage.removeItem('maha_pramaan_role');
    }
  };

  return (
    <AppContext.Provider value={{
      role,
      setRole: handleSetRole,
      sidebarOpen,
      setSidebarOpen,
      searchOpen,
      setSearchOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
