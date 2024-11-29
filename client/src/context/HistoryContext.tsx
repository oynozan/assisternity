import { createContext, useContext, useState } from "react";

interface IMessage {
    timestamp: number;
    content: string;
    isAnswer: boolean;
}

interface IChat {
    id: string;
    title: string;
    messages: IMessage[];
}

interface IHistoryContext {
    chats: IChat[];
    clearHistory: (id: string) => void;
}

const HistoryContext = createContext<IHistoryContext>({
    chats: [],
    clearHistory: () => {},
});

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<IChat[]>([]);

    const clearHistory = (id: string) => {
        setHistory(prev => prev.filter(chat => chat.id !== id));
    };

    return (
        <HistoryContext.Provider value={{ chats: history, clearHistory }}>{children}</HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    return context;
};
