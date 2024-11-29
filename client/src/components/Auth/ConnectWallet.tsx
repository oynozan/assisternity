import toast from "react-hot-toast";

import Button from "../Button";
import { useUser } from "../../context/UserContext";
import { useWallet } from "../../context/WalletContext";
import { truncateWalletAddress } from "../../lib/helpers";

import "./connect-wallet.scss";

export default function ConnectWallet() {
    const { user } = useUser();
    const { connectWallet, disconnect } = useWallet();

    return (
        <>
            {user?.wallet ? (
                <Button
                    className="connect-wallet"
                    variant="primary"
                    onClick={async () => {
                        const result = await disconnect();
                        if (result) {
                            toast.success("Wallet disconnected successfully");
                        }
                    }}
                >
                    {truncateWalletAddress(user.wallet)}
                </Button>
            ) : (
                <Button className="connect-wallet" variant="primary" onClick={connectWallet}>
                    Connect Wallet
                </Button>
            )}
        </>
    );
}
