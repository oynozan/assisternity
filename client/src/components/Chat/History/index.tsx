import axios from "axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import "./history.scss";

export default function ChatHistory() {
    const navigate = useNavigate();

    const [chatCount, setChatCount] = useState(3);

    const { isLoading, data: chats } = useQuery({
        queryKey: ["chat-history"],
        queryFn: getChatHistory,
    });

    async function getChatHistory() {
        const response = await axios.get(process.env.REACT_APP_BACKEND + "/chats");
        return response.data;
    }

    useEffect(() => {
        const localChatCount = localStorage.getItem("chat-count");
        if (localChatCount) setChatCount(parseInt(localChatCount));
    }, []);

    if (isLoading) {
        return <Skeleton count={chatCount} />;
    }

    return (
        <div className="chat-history">
            {chats?.chats.map((chat: any) => (
                <div key={chat.id} className="chat" onClick={() => navigate(`/chat/${chat.id}`)}>
                    <h3>{chat.title}</h3>
                </div>
            ))}
        </div>
    );
}
