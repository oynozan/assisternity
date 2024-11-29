import { createContext, useContext, useState } from "react";
import { simpleConfirm } from "react-simple-dialogs";

import { useUser } from "./UserContext";
import Wallet from "../lib/wallet";

interface IWalletContext {
    address: string | null;
    error?: string;
    connectWallet: () => void;
    disconnect: (forced?: boolean) => Promise<boolean>;
    signMessage: (message: string) => Promise<string>;
}

const WalletContext = createContext<IWalletContext>({
    address: null,
    connectWallet: () => {},
    disconnect: async () => false,
    signMessage: async () => "",
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { setUser } = useUser();

    const [walletHandler, setWalletHandler] = useState<Wallet | null>(null);

    const [address, setAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | undefined>(undefined);

    const connectWallet = () => {
        const wallet = new Wallet();
        setWalletHandler(wallet);

        wallet
            .init()
            .then(() => {
                setAddress(wallet.address);
                setUser({ wallet: wallet.address });
            })
            .catch(error => {
                console.error(error);
                setError(error.message);
            });
    };

    const disconnect = async (forced = false) => {
        const reset = () => {
            setAddress(null);
            setUser(null);

            localStorage.removeItem("metamask-wallet-address");
        };

        if (forced) {
            reset();
            return true;
        }
        if (await simpleConfirm("Are you sure you want to disconnect your wallet?")) {
            reset();
            return true;
        }

        return false;
    };

    const signMessage = async (message: string) => {
        if (!walletHandler) {
            throw new Error("Wallet is not connected");
        }
        const signedMessage = await walletHandler.signMessage(message);
        if (!signedMessage) {
            throw new Error("Failed to sign message");
        }
        return signedMessage;
    };

    return (
        <WalletContext.Provider value={{ address, error, connectWallet, disconnect, signMessage }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    return context;
};
