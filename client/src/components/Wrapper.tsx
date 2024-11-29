import { Toaster } from "react-hot-toast";
import { SimpleDialogContainer } from "react-simple-dialogs";

import AuthHandler from "./Auth/AuthHandler";
import { UserProvider } from "../context/UserContext";
import { WalletProvider } from "../context/WalletContext";
import { HistoryProvider } from "../context/HistoryContext";

export default function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <HistoryProvider>
                <WalletProvider>
                    <AuthHandler />
                    {children}
                    <SimpleDialogContainer />
                    <Toaster />
                </WalletProvider>
            </HistoryProvider>
        </UserProvider>
    );
}
