import type { Wallet } from '../wallets';

export interface Config {
    wallets?: Wallet[];
    autoReconnect?: boolean;
}

interface ConfigOptions {
    wallets?: Wallet[]
    autoReconnect?: boolean;
}

export function createConfig(options?: ConfigOptions): Config {
    return {
        ...options,
    };
}