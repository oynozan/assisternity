import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { parse as parseCookie } from "cookie";

import Chat from "./socket/chat";
import usersDB from "./models/Users";
import { validateSignature } from "./routes/auth";

export const initializeSocket = (server: any, whitelist: string[]) => {
    const io = new Server(server, {
        cors: {
            origin: whitelist,
            credentials: true,
        },
    });

    io.use((socket: any, next) => {
        if (socket.handshake.headers.cookie) {
            const parsedCookies = parseCookie(socket.handshake.headers.cookie);
            const userCookie = parsedCookies["signature"];

            if (userCookie) socket.cookie = userCookie;
        }

        next();
    });

    callSocketFunctions(io);
};

export const getUser = async (socket: any, address: `ak_${string}`) => {
    const signatureCookie = socket.cookie;
    if (!signatureCookie) return null;

    const decoded = jwt.verify(signatureCookie, process.env.JWT_SECRET!);

    if (validateSignature(decoded as string, address)) {
        return await usersDB.findOne({ wallet: address });
    }

    return null;
};

const callSocketFunctions = (io: any) => {
    Chat(io);
};
