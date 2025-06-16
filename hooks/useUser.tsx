import { useSimpleUser } from "@/providers/SupabaseProvider";
import { Profile } from "@/types";

type UserContextType = {
    accessToken: string | null;
    user: any;
    userDetails: Profile | null;
    isLoading: boolean;
}

// Simple user hook that returns the mock user
export const useUser = (): UserContextType => {
    const { user } = useSimpleUser();
    
    return {
        accessToken: 'mock-token',
        user: user,
        userDetails: user as Profile,
        isLoading: false,
    };
};