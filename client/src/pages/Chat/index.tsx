import toast from "react-hot-toast";
import { Suspense, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate, useParams } from "react-router-dom";

import socket from "../../lib/socket";
import Input from "../../components/Input";
import Button from "../../components/Button";
import LeftNav from "../../components/Leftnav";
import Example from "../../components/Chat/Example";
import { useUser } from "../../context/UserContext";
import ChatMessages from "../../components/Chat/Messages";
import ConnectWallet from "../../components/Auth/ConnectWallet";

import { BsSendFill } from "react-icons/bs";

import "./wrapper.scss";
import "./chat.scss";

const EXAMPLES = [
    "Tell me how to write a token contract with Sophia",
    "I want to send AE coin to an address",
    "How do I deploy a smart contract on the æternity blockchain?",
];

export default function Chat() {
    const navigate = useNavigate();

    const { id } = useParams();

    const { user } = useUser();

    const formRef = useRef<HTMLFormElement>(null);

    async function sendMessage(e: React.FormEvent<HTMLFormElement> | null, presetMessage: string = "") {
        let message;
        if (!presetMessage) {
            e!.preventDefault();

            if (!formRef.current) return;
            const formData = new FormData(formRef.current!);

            message = formData.get("message") as string;
            if (!message) return;
        } else {
            message = presetMessage;
        }

        // Check if user is logged in
        if (!user) {
            toast.error("Please connect your wallet to chat");
            return;
        }

        type SendMessage = { id: string; response: string; status: boolean; message?: string };

        socket.off("chat-sendMessage");
        socket.emit("chat-sendMessage", { message, address: user.wallet, id });

        toast("Please wait...");

        socket.on("chat-joinRoom", (data: { id: string }) => {
            toast.dismiss();

            if (data.id) {
                navigate(`/chat/${data.id}`);
            }
        });

        socket.on("chat-sendMessage", (data: SendMessage) => {
            toast.dismiss();

            if (data.status) {
                if (formRef.current) formRef.current.reset();

                // Navigate to chat
                navigate(`/chat/${data.id}`);
            } else toast.error(data.message!);
        });
    }

    function runExample(example: string) {
        sendMessage(null, example);
    }

    return (
        <div id="chat-wrapper">
            <LeftNav />
            <div id="chat">
                <ConnectWallet />
                {id ? (
                    <div className="messages-container">
                        <Suspense fallback={<SkeletonLoadingTemplate />}>
                            <ErrorBoundary fallback={<div>Error while loading the chat</div>}>
                                <ChatMessages id={id} />
                            </ErrorBoundary>
                        </Suspense>
                    </div>
                ) : (
                    <>
                        <div className="brand">
                            <img src="/images/logo.svg" alt="Assisternity" />
                            <div>
                                <h1>Assisternity</h1>
                                <p>Your AI companion on æternity blockchain</p>
                            </div>
                        </div>
                        <div className="start-chat">
                            <div className="chat-example">
                                <Example example={EXAMPLES[0]} runExample={runExample} />
                                <Example example={EXAMPLES[1]} runExample={runExample} />
                                <Example example={EXAMPLES[2]} runExample={runExample} />
                            </div>
                        </div>
                    </>
                )}

                <form onSubmit={sendMessage} ref={formRef}>
                    <div>
                        <Input type="text" name="message" placeholder="Type a message..." rounded />
                        <Button
                            type="submit"
                            variant="secondary"
                            icon={<BsSendFill color="#acacac" size={18} />}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

function SkeletonLoadingTemplate() {
    return (
        <div className="skeleton">
            <Skeleton count={3} />
        </div>
    );
}
