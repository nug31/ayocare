import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guru';
  subject?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Data akun dummy untuk demo - dalam implementasi nyata ini akan dari database
const DEMO_ACCOUNTS = [
  // Admin accounts
  {
    id: 'admin1',
    name: 'Super Admin',
    email: 'admin@ayocare.com',
    password: 'admin123',
    role: 'admin' as const,
    department: 'IT Management'
  },
  {
    id: 'admin2',
    name: 'Safety Manager',
    email: 'safety.admin@smk.edu',
    password: 'admin123',
    role: 'admin' as const,
    department: 'Safety Management'
  },
  // User accounts
  {
    id: 'user1',
    name: 'Andi Setiawan',
    email: 'andi.user@smk.edu',
    password: 'user123',
    role: 'user' as const,
    department: 'Elektronika'
  },
  {
    id: 'user2',
    name: 'Sari Indah',
    email: 'sari.user@smk.edu',
    password: 'user123',
    role: 'user' as const,
    department: 'Teknik Mesin'
  },
  {
    id: 'user3',
    name: 'Roni Pratama',
    email: 'roni.user@smk.edu',
    password: 'user123',
    role: 'user' as const,
    department: 'Otomotif'
  },
  // Guru accounts (backward compatibility)
  {
    id: '1',
    name: 'Siti Nurhaliza',
    email: 'siti.guru@smk.edu',
    password: 'guru123',
    role: 'guru' as const,
    subject: 'Elektronika'
  },
  {
    id: '2',
    name: 'Ahmad Rizki',
    email: 'ahmad.guru@smk.edu',
    password: 'guru123',
    role: 'guru' as const,
    subject: 'Teknik Mesin'
  },
  {
    id: '3',
    name: 'Budi Santoso',
    email: 'budi.guru@smk.edu',
    password: 'guru123',
    role: 'guru' as const,
    subject: 'Otomotif'
  },
  {
    id: '4',
    name: 'Maria Dewi',
    email: 'maria.guru@smk.edu',
    password: 'guru123',
    role: 'guru' as const,
    subject: 'Administrasi'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cek apakah user sudah login sebelumnya (dari localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('ayocare_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('ayocare_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulasi delay untuk login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const account = DEMO_ACCOUNTS.find(
      acc => acc.email === email && acc.password === password
    );
    
    if (account) {
      const user: User = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        subject: account.subject,
        department: account.department
      };
      
      setUser(user);
      localStorage.setItem('ayocare_user', JSON.stringify(user));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ayocare_user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
