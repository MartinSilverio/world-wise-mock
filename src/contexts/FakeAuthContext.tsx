import { ReactNode, createContext, useContext, useReducer } from 'react';

interface UserType {
    name: string;
    email: string;
    password: string;
    avatar: string;
}
const FAKE_USER: UserType = {
    name: 'Jack',
    email: 'jack@example.com',
    password: 'qwerty',
    avatar: 'https://i.pravatar.cc/100?u=zz',
};

interface AuthContextType {
    user: UserType | null;
    isAuthenticated: boolean;
    login?: (u: string, p: string) => void;
    logout?: () => void;
}

const initialState: AuthContextType = {
    user: null,
    isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType>(initialState);

interface ActionLogin {
    type: 'auth/login';
    payload: UserType;
}

interface ActionLogout {
    type: 'auth/logout';
}

type UserLoginActions = ActionLogin | ActionLogout;

function reducer(
    state: AuthContextType,
    action: UserLoginActions
): AuthContextType {
    switch (action.type) {
        case 'auth/login':
            return { ...state, user: action.payload, isAuthenticated: true };
        case 'auth/logout':
            return { ...state, user: null, isAuthenticated: false };
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [{ user, isAuthenticated }, dispatch] = useReducer(
        reducer,
        initialState
    );

    function login(email: string, password: string) {
        if (email === FAKE_USER.email && password === FAKE_USER.password) {
            dispatch({ type: 'auth/login', payload: FAKE_USER });
        }
    }

    function logout() {
        dispatch({ type: 'auth/logout' });
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined)
        throw new Error('AuthContext was used outside AuthProvider');

    return context;
}
