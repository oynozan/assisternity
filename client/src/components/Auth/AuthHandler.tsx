import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useUser } from "../../context/UserContext";
import { useWallet } from "../../context/WalletContext";

export default function AuthHandler() {
    const { user, validated, setValidated } = useUser();
    const { connectWallet, signMessage, disconnect } = useWallet();

    const [signing, setSigning] = useState(false);

    const fetchLogin = async () => {
        if (!user) return { status: false };

        console.log("Fetching login");
        try {
            var { data: userRes } = await axios.post(
                process.env.REACT_APP_BACKEND + "/auth/sign-in",
                {
                    address: user.wallet,
                },
                {
                    withCredentials: true,
                }
            );
        } catch (error) {
            return { status: false };
        }

        return userRes;
    };

    const {
        isLoading,
        refetch: getUser,
        data: userLoginResponse,
    } = useQuery({
        queryKey: ["user-login"],
        queryFn: fetchLogin,
        enabled: false,
    });

    const signatureFail = (message: string) => {
        toast.error(message);
        setSigning(false);
        disconnect(true);
    };

    useEffect(() => {
        if (localStorage.getItem("metamask-wallet-address")) {
            connectWallet();
        }
    }, []);

    useEffect(() => {
        if (user && !isLoading && !validated && !signing) {
            (async () => {
                // Try to login
                console.log("Trying to login");
                await getUser();
            })();
        }
    }, [user]);

    useEffect(() => {
        if (userLoginResponse?.status) {
            setValidated(true);
        } else if (userLoginResponse?.status === false && user && !signing) {
            (async () => {
                console.log("Failed to login, signing message");
                setSigning(true);
                try {
                    var signature = await signMessage(
                        "Welcome to Assisternity, sign this message to continue"
                    );
                } catch (error) {
                    console.error(error);
                    signatureFail("Failed to sign message");
                    return;
                }

                // Validate signature
                console.log("Validating signature");
                try {
                    var { data: validationRes } = await axios.post(
                        process.env.REACT_APP_BACKEND + "/auth/validate-signature",
                        {
                            signature,
                            address: user!.wallet,
                        },
                        {
                            withCredentials: true,
                        }
                    );
                } catch (error) {
                    console.error(error);
                    signatureFail("Failed to validate signature");
                    return;
                }

                if (!validationRes.status) {
                    signatureFail("Invalid signature");
                    return;
                }

                // Try to login again
                console.log("Signature successful, trying to login again");
                setSigning(false);
                getUser();
            })();
        }
    }, [userLoginResponse]);

    return null;
}
