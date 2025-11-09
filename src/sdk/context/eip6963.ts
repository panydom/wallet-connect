import type { Eip1193Provider } from 'ethers';

interface EIP6963ProviderInfo {
    name: string;
    uuid: string;
    icon: string;
    rdns: string;
}

export interface EIP6963ProviderDetail {
    info: EIP6963ProviderInfo;
    provider: Eip1193Provider
}

export type EIP6963AnnounceProviderEvent = {
    detail: {
        info: EIP6963ProviderInfo
        provider: Readonly<Eip1193Provider>
    }
}
