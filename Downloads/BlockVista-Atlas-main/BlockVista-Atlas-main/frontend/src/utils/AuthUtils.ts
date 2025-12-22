import { AtlasMode } from '../context/ModeContext';

const API_BASE = 'http://localhost:8000/api/v1/auth';

export interface AtlasUser {
    name: string;
    role: AtlasMode;
    // PIN and Security Info are handled by backend now
}

export interface AuthResponse {
    success: boolean;
    user?: AtlasUser;
    isAdmin?: boolean;
    error?: string;
    pin?: string; // For reveal
    question?: string; // For recovery
    sessionId?: string;
}

export const AuthUtils = {
    register: async (name: string, role: AtlasMode, question: string, answer: string): Promise<AuthResponse> => {
        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, role, security_question: question, security_answer: answer })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Registration failed');

            return {
                success: true,
                user: { name: data.name, role }, // Role is echoed back or we assume strictly what we sent. 
                // Wait, api returns {pin, name}. Role isn't in response, but we know it.
                pin: data.pin
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    },

    login: async (pin: string): Promise<AuthResponse> => {
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Login failed');

            return {
                success: true,
                user: { name: data.name, role: data.role as AtlasMode },
                isAdmin: data.isAdmin,
                sessionId: data.sessionId
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    },

    findUserByName: async (name: string): Promise<AuthResponse> => {
        try {
            const res = await fetch(`${API_BASE}/recovery-lookup?name=${encodeURIComponent(name)}`, {
                method: 'POST'
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'User not found');

            return { success: true, question: data.question };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    },

    resetPin: async (name: string, answer: string): Promise<AuthResponse> => {
        try {
            const res = await fetch(`${API_BASE}/reset-pin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, security_answer: answer })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Reset failed');

            return { success: true, pin: data.pin };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }
};
