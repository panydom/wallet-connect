import type { BrowserProvider } from 'ethers';

export interface ConnectResponse {
    account: string;
    balance: bigint;
    value: string;
    provider: BrowserProvider;
    network: {
        name: string;
        chainId: bigint;
    }
}

export interface Wallet {
    name: string;
    icon?: string;
    exists?: boolean;
    connectText?: string;
    connect: () => Promise<ConnectResponse>;
    switchNetwork: (network: ConnectResponse['network']) => Promise<void>;
}