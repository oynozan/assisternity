import { Router } from "express";
import chatsDB from "../models/Chats";

const router = Router();

// TODO: Implement user verification middleware to all routes

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const chat = await chatsDB.findById(id);
        if (!chat) {
            res.status(404).send("Chat not found");
            return;
        }

        res.status(200).send({
            title: chat.title,
            messages: chat.messages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.get("/", async (req, res) => {
    try {
        const chatsRaw = await chatsDB.find();
        const chats = chatsRaw.map(chat => {
            return {
                id: chat._id.toString(),
                title: chat.title,
            };
        });

        res.status(200).send({ chats });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

export default router;
