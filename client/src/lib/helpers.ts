export function truncateWalletAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function bufferToBase64(buffer: Uint8Array) {
    const base64url = await new Promise<string>(r => {
        const reader = new FileReader();
        reader.onload = () => r(reader.result as string);
        reader.readAsDataURL(new Blob([buffer]));
    });
    return base64url.slice(base64url.indexOf(",") + 1);
}

export async function bufferToHex(buffer: Uint8Array) {
    return Array.from(buffer)
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}