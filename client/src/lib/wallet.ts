import { AESnap, NetworkId } from "@aeternity-snap/sdk";

interface IWallet {
    address: string;

    init(): Promise<void>;
    signMessage(message: string): Promise<string | undefined>;
}

export default class Wallet implements IWallet {
    public address: string;
    private snap: AESnap;

    constructor() {
        // this.init();
    }

    async init() {
        this.snap = await AESnap.connect(NetworkId.mainnet);
        const response = await this.snap.getPublicKey();
        if (response?.publicKey) this.address = response.publicKey;
    }

    async signMessage(message: string) {
        const result = (await this.snap?.signMessage(btoa(message))) as Partial<{
            publicKey: string;
            signature: string;
        }>;
        return result?.signature;
    }
}
