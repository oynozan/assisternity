import { createContext, useContext, useState } from "react";

interface IUser {
    wallet: string;
}

interface IUserContext {
    user: IUser | null;
    validated: boolean;
    setUser: (user: IUser | null) => void;
    setValidated: (validated: boolean) => void;
}

const UserContext = createContext<IUserContext>({
    user: null,
    validated: false,
    setUser: () => {},
    setValidated: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [validated, setValidated] = useState(false);

    return (
        <UserContext.Provider value={{ user, validated, setUser, setValidated }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    return context;
};
