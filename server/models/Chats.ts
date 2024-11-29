import { model, Schema } from "mongoose";

export interface IChats {
    title: string;
    user: string;
    messages: Array<{
        timestamp: number;
        content: string;
        isAnswer: boolean;
        identity: "CHAT" | "TRANSACTION" | "CONTRACT";
    }>;
}

const chatSchema = new Schema<IChats>({
    title: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    messages: {
        type: [
            new Schema(
                {
                    timestamp: {
                        type: Number,
                        required: true,
                    },
                    content: {
                        type: String,
                        required: true,
                    },
                    isAnswer: {
                        type: Boolean,
                        required: true,
                    },
                    identity: {
                        enum: ["CHAT", "TRANSACTION", "CONTRACT"],
                    },
                },
                {
                    _id: false,
                }
            ),
        ],
        default: [],
    },
});

const ChatsModel = model("chats", chatSchema);
export default ChatsModel;
