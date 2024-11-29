import AI from "../lib/ai";
import chatsDB from "../models/Chats";
import { getUser } from "../socket";

type SendMessage = { message: string; address: `ak_${string}`; chatID?: string };

function listen(io: any) {
    io.on("connection", (socket: any) => {
        socket.on("chat-sendMessage", async (data: SendMessage) => {
            const user = await getUser(socket, data?.address);
            if (!user) {
                socket.emit("chat-sendMessage", { status: false, message: "Invalid user" });
                return;
            }

            try {
                let title: string = "";
                let id: string | undefined = data.chatID;
                const ai = new AI();

                if (!data.chatID) {
                    /// Create a new chat
                    // Get a title summary for chat
                    title = (await ai.titleSummary(data.message)) || "";

                    if (!title) {
                        socket.emit("chat-sendMessage", { status: false, message: "Failed to get title" });
                        return;
                    }

                    // Create a new chat record in database
                    var chat = new chatsDB({
                        user: user.wallet,
                        title,
                        messages: [],
                    });

                    await chat.save();
                    id = chat._id.toString();
                }

                socket.emit("chat-joinRoom", { id });

                const streamingFunc = (content: string) => {
                    socket.emit("chat-stream", {
                        status: true,
                        content,
                    });
                };

                // Create response
                const response = await ai.answer(data.message, streamingFunc);

                // Save message to chat
                await chatsDB.findByIdAndUpdate(id!, {
                    $push: {
                        messages: {
                            $each: [
                                {
                                    timestamp: Date.now(),
                                    content: data.message,
                                    isAnswer: false,
                                },
                                {
                                    timestamp: Date.now(),
                                    content: response.response,
                                    isAnswer: true,
                                    identity: response.identity,
                                },
                            ],
                        },
                    },
                });

                // Send response
                socket.emit("chat-sendMessage", {
                    id,
                    content: response.response,
                    identity: response.identity,
                    title,
                    status: true,
                });
            } catch (error) {
                console.error(error);
                socket.emit("chat-sendMessage", { status: false, message: "Failed to send message" });
                return;
            }
        });
    });
}

export default listen;
