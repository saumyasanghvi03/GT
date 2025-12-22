import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AtlasMode = 'AMC' | 'Wealth' | 'Advisor' | 'Institutional';

interface ModeContextType {
    mode: AtlasMode;
    setMode: (mode: AtlasMode) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (auth: boolean) => void;
    userName: string;
    setUserName: (name: string) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
    // Initialize from LocalStorage to prevent logout on refresh
    const [mode, setMode] = useState<AtlasMode>(() => (localStorage.getItem('atlas_mode') as AtlasMode) || 'AMC');
    const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('atlas_auth') === 'true');
    const [userName, setUserName] = useState(() => localStorage.getItem('atlas_user') || 'Guest');

    // Persist changes
    useEffect(() => {
        localStorage.setItem('atlas_mode', mode);
        localStorage.setItem('atlas_auth', String(isAuthenticated));
        localStorage.setItem('atlas_user', userName);
    }, [mode, isAuthenticated, userName]);

    const value = { mode, setMode, isAuthenticated, setIsAuthenticated, userName, setUserName };

    return (
        <ModeContext.Provider value={value}>
            {children}
        </ModeContext.Provider>
    );
};

export const useMode = () => {
    const context = useContext(ModeContext);
    if (!context) {
        throw new Error('useMode must be used within a ModeProvider');
    }
    return context;
};
