"use client"

import React, { createContext, useContext } from "react"

interface SimpleUser {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    images_generated: number;
    paid: boolean;
    subscription_id: string | null;
    user_metadata: {
        email: string;
    };
}

interface SimpleProviderProps {
    children: React.ReactNode
}

interface SimpleContextType {
    user: SimpleUser;
    session: {
        user: SimpleUser;
    };
}

const SimpleContext = createContext<SimpleContextType | undefined>(undefined);

const SimpleProvider: React.FC<SimpleProviderProps> = ({
    children
}) => {
    // Create a mock user with unlimited access
    const mockUser: SimpleUser = {
        id: 'free-user',
        username: 'Free User',
        full_name: 'Free User',
        avatar_url: '',
        images_generated: 0,
        paid: true, // Set to true for unlimited access
        subscription_id: null,
        user_metadata: {
            email: 'user@example.com'
        }
    };

    const value = {
        user: mockUser,
        session: {
            user: mockUser
        }
    };

    return (
        <SimpleContext.Provider value={value}>
            {children}
        </SimpleContext.Provider>
    ) 
}

export const useSimpleUser = () => {
    const context = useContext(SimpleContext);
    if (context === undefined) {
        throw new Error('useSimpleUser must be used within a SimpleProvider');
    }
    return context;
};

export default SimpleProvider
