import OpenAI from "openai";
import { Prompts } from "../data/prompts";

type Identification = "CHAT" | "TRANSACTION" | "CONTRACT";

interface IAI {
    openai: OpenAI;
    identification: Identification;

    identify(input: string): Promise<Identification>;
    callMethods(): void;
    answer(
        input: string,
        streamFunc?: (content: string) => void
    ): Promise<{
        identity: Identification;
        response: string;
    }>;
}

export default class AI implements IAI {
    openai: OpenAI;
    identification: "CHAT" | "TRANSACTION" | "CONTRACT" = "CHAT";

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async answer(input: string, streamFunc?: (content: string) => void) {
        this.identification = await this.identify(input);
        console.log(this.identification);

        const stream = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                ...(Prompts[this.identification.toLowerCase() as keyof typeof Prompts] as {
                    role: "user" | "assistant" | "system";
                    content: string;
                }[]),
                {
                    role: "user",
                    content: input,
                },
            ],
            stream: true,
        });

        let fullResponse = "";

        for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
                streamFunc?.(content);
                fullResponse += content;
            }
        }

        return {
            identity: this.identification,
            response: fullResponse,
        };
    }

    async identify(input: string) {
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                ...(Prompts.identify as {
                    role: "user" | "assistant" | "system";
                    content: string;
                }[]),
                {
                    role: "user",
                    content: input,
                },
            ],
        });

        return completion.choices[0].message.content as Identification;
    }

    async callMethods() {}

    async titleSummary(rawMessage: string) {
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                ...(Prompts.titleSummary as {
                    role: "user" | "assistant" | "system";
                    content: string;
                }[]),
                {
                    role: "user",
                    content: rawMessage,
                },
            ],
        });

        return completion.choices[0].message.content;
    }
}
