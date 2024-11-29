import { verifyMessage } from "@aeternity/aepp-sdk";
import { Router } from "express";
import jwt from "jsonwebtoken";

import usersDB from "../models/Users";

const router = Router();

const signatureMessage = "Welcome to Assisternity, sign this message to continue";

export function validateSignature(signature: string, address: `ak_${string}`) {
    if (!signature || !address) {
        return false;
    }

    const encodedMsg = btoa(signatureMessage);
    const messageBytes = Buffer.from(encodedMsg, "base64");
    const decodedMessage = new TextDecoder().decode(messageBytes);
    const verifiedMessage = verifyMessage(decodedMessage, Buffer.from(signature, "base64"), address);

    return verifiedMessage;
}

router.post("/validate-signature", async (req, res) => {
    try {
        const { signature, address } = req.body;

        const validation = validateSignature(signature, address);
        if (!validation) {
            res.status(400).send({ status: false });
            return;
        }

        res.cookie("signature", jwt.sign(signature, process.env.JWT_SECRET!), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 90,
        });

        res.status(200).send({ status: true });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.post("/sign-in", async (req, res) => {
    try {
        const { address } = req.body;

        const user = await usersDB.findOne({ wallet: address });
        const signature = req.cookies["signature"];

        // Check encrypted signature
        jwt.verify(signature, process.env.JWT_SECRET!, async (err: any, decoded: any) => {
            if (err) {
                res.status(401).send({ status: false });
                return;
            }

            const validation = validateSignature(decoded, address);
            if (!validation) {
                res.status(400).send({ status: false });
                return;
            }

            if (!user) {
                // Create new user
                const newUser = new usersDB({
                    wallet: address,
                    signature: decoded as string,
                    registrationDate: new Date(),
                });

                await newUser.save();
            }

            res.status(200).send({ status: true });
            return;
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

export default router;
