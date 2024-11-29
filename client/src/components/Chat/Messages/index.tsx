import axios from "axios";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";

import socket from "../../../lib/socket";

import "./messages.scss";
import ReactMarkdown from "react-markdown";

interface IStream {
    message?: string;
    content?: string;
    status: boolean;
    title?: string;
    identity?: "CHAT" | "TRANSACTION" | "CONTRACT";
}

export default function ChatMessages({ id }: { id?: string }) {
    const { showBoundary } = useErrorBoundary();

    const [messages, setMessages] = useState<
        Array<{
            timestamp: number;
            content: string;
            isAnswer: boolean;
            identity: "CHAT" | "TRANSACTION" | "CONTRACT";
        }>
    >([]);
    const [response, setResponse] = useState<string>("");

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + `/chats/${id}`).then(({ data }) => {
            setMessages(data.messages);
        });

        socket.off("chat-stream");
        socket.on("chat-stream", (data: IStream) => {
            if (data.status) {
                setResponse(d => d + data.content!);
            } else {
                showBoundary(data.message);
            }
        });

        socket.off("chat-sendMessage");
        socket.on("chat-sendMessage", (data: IStream) => {
            if (data.status) {
                setResponse("");
                setMessages(m => [
                    ...m,
                    {
                        timestamp: Date.now(),
                        content: data.content!,
                        isAnswer: true,
                        identity: data.identity!,
                    },
                ]);
            } else {
                showBoundary(data.message);
            }
        });
    }, [id]);

    return (
        <div className="messages">
            {messages.map((message, i) => (
                <div key={i} className={`message ${message.isAnswer ? "answer" : "question"}`}>
                    <p>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </p>
                </div>
            ))}
            {response && (
                <div className="message answer">
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}
