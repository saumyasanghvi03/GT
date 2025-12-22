import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'ADMIN' | 'ANALYST';

interface User {
    id: string;
    name: string;
    role: UserRole;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (role: UserRole) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>({
        id: 'user_001',
        name: 'Demo Analyst',
        role: 'ANALYST',
        email: 'analyst@blockvista.com'
    });
    const [isLoading, setIsLoading] = useState(false);

    const login = (role: UserRole = 'ANALYST') => {
        setIsLoading(true);
        // Simulate network delay
        setTimeout(() => {
            setUser({
                id: role === 'ADMIN' ? 'admin_001' : 'user_001',
                name: role === 'ADMIN' ? 'System Admin' : 'Demo Analyst',
                role: role,
                email: role === 'ADMIN' ? 'admin@blockvista.com' : 'analyst@blockvista.com'
            });
            setIsLoading(false);
        }, 500);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            logout,
            isAuthenticated: !!user
        }}>
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
