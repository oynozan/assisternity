export const Actions = ["CHAT", "TRANSACTION", "CONTRACT"];

export const Prompts = {
    identify: [
        {
            role: "system",
            content: `You will be given an instruction something about Aeternity blockchain. You need to identify what kind of instruction it is. Your output must be one of these identifications: ${Actions.join(
                ", "
            )}. The CHAT action is when the user asks informative questions. The TRANSACTION action is when user wants to make a transaction. The CONTRACT action is when user wants to deploy a smart contract.`,
        },
        {
            role: "user",
            content: `Tell me how to write a token contract with Sophia`,
        },
        {
            role: "assistant",
            content: "CHAT",
        },
        {
            role: "user",
            content: `I want to send AE coin to an address`,
        },
        {
            role: "assistant",
            content: "TRANSACTION",
        },
        {
            role: "user",
            content: `I want to deploy a NFT contract on Aeternity?`,
        },
        {
            role: "assistant",
            content: "CONTRACT",
        },
        {
            role: "user",
            content: `How can I calculate fees?`,
        },
        {
            role: "assistant",
            content: "CHAT",
        },
    ],
    chat: [
        {
            role: "system",
            content: `You are a helpful assistant in the Aeternity blockchain. Users will ask you questions about Aeternity blockchain and you will help them with short, informal answers.`,
        },
    ],
    transaction: [
        {
            role: "system",
            content: `You are a transaction assistant. Users will ask you to make transactions on the Aeternity blockchain. You will help them with the transaction process.`,
        },
        // TODO: Implement transaction prompts
    ],
    contract: [
        {
            role: "system",
            content: `You are a contract assistant. Users will ask you to deploy smart contracts on the Aeternity blockchain. You will help them with the contract deployment process.`,
        },
        // TODO: Implement contract prompts
    ],
    titleSummary: [
        {
            role: "system",
            content: `You will be given a raw message from the user. You need to summarize the message into a title.`,
        },
        {
            role: "user",
            content: `Tell me how to write a token contract with Sophia`,
        },
        {
            role: "assistant",
            content: "Writing token contract with Sophia",
        },
        {
            role: "user",
            content: `I want to send AE coin to an address`,
        },
        {
            role: "assistant",
            content: "Sending AE coin to an address",
        },
        {
            role: "user",
            content: `I want to deploy a NFT contract on Aeternity?`,
        },
        {
            role: "assistant",
            content: "Deploying a NFT contract on Aeternity",
        },
    ],
};
