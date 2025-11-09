import { createContext } from 'react';

import type { Wallet, ConnectResponse } from '@/sdk/wallets';

interface OpenModal {
    (): void;
}

interface CloseModal {
    (): void;
}

export const ConnectStatus = {
    INITIAL: 0,
    CONNECTING: 1,
    CONNECTED: 2,
} as const;

export type CONNECT_STATUS = typeof ConnectStatus[keyof typeof ConnectStatus];

export interface ContextType extends Partial<ConnectResponse> {
    connectStatus: CONNECT_STATUS;
    openModal: OpenModal;
    closeModal: CloseModal;
    modalVisible: boolean;
    wallets: Wallet[];
    currentWallet: Wallet | null,
    switching: boolean,
    connectWallet: (wallet: Wallet) => Promise<void>;
    disconnect: () => void;
    switchNetwork: () => void;
}

export const ConnectContext = createContext<ContextType>({
    connectStatus: ConnectStatus.INITIAL,
    openModal: () => { },
    closeModal: () => { },
    modalVisible: false,
    switching: false,
    wallets: [],
    currentWallet: null,
    connectWallet: async () => { },
    disconnect: () => { },
    switchNetwork: () => { },
});