import { useEffect, useRef, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useSetState, useMount } from 'react-use';
import toast, { Toaster } from 'react-hot-toast';

import { ConnectContext, ConnectStatus } from './base';
import { metaMask } from '@/sdk/wallets';
import { BrowserProvider, formatEther } from 'ethers';
import type { ContextType } from './base';
import type { Config } from '../utils';
import type { Wallet } from '@/sdk/wallets';
import type { EIP6963AnnounceProviderEvent, EIP6963ProviderDetail } from './eip6963';

interface ProviderProps {
    children: ReactNode;
    config: Config
}

const currentWalletStorageKey = "CURRENT_WALLET_NAME";

let providers: EIP6963ProviderDetail[] = [];

function attactWallet(callback: (p: EIP6963ProviderDetail[]) => void) {
    function onProvider(event: EIP6963AnnounceProviderEvent) {
        if (providers.some(p => p.info.uuid === event.detail.info.uuid)) {
            return;
        }
        providers = [...providers, event.detail];
        callback(providers);
    }

    // @ts-expect-error no-error
    window.addEventListener("eip6963:announceProvider", onProvider);

    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => {
        // @ts-expect-error no-error
        window.removeEventListener('eip6963:announceProvider', onProvider);
    };
}

export function ConnectProvider({ children, config }: ProviderProps) {

    const [eip6963, setEip6963] = useState<EIP6963ProviderDetail[]>([]);
    const [state, setState] = useSetState<Omit<ContextType, 'openModal' | 'closeModal' | 'connectWallet' | 'disconnect' | 'switchNetwork'>>({
        connectStatus: ConnectStatus.INITIAL,
        switching: false,
        modalVisible: false,
        wallets: config.wallets || [metaMask],
        currentWallet: null,
    });

    // 使用 ref 保存最新的 state
    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    function openModal() {
        setState({
            modalVisible: true,
        });
    }

    function closeModal() {
        setState({
            modalVisible: false,
        });
    }

    /**
     * 连接到钱包
     * @param wallet 
     */
    async function connectWallet(wallet: Wallet) {
        try {
            setState({
                connectStatus: ConnectStatus.CONNECTING,
            });
            const { account, balance, value, network, provider } = await wallet.connect();

            setState({
                provider,
                currentWallet: wallet,
                account,
                balance,
                value,
                network,
                connectStatus: ConnectStatus.CONNECTED,
            });
        }
        catch (e) {
            setState({
                connectStatus: ConnectStatus.INITIAL,
            });
            // @ts-expect-error 错误信息
            if (e?.reason === "rejected") {
                toast.error("用户取消授权");
            }
            throw e;
        }
    }

    function disconnect() {
        setState({
            currentWallet: null,
            account: '',
            balance: 0n,
            value: '',
            provider: undefined,
            connectStatus: ConnectStatus.INITIAL,
        });
    }

    async function switchNetwork() {
        try {
            setState({
                switching: true,
            });
            const currentState = stateRef.current;
            console.log(currentState); // 现在可以获取最新值了

            if (!currentState.currentWallet) {
                toast.error("未连接钱包");
                return;
            }

            await currentState.currentWallet.switchNetwork(currentState.network!);
            toast.success("切换成功");
            await connectWallet(currentState.currentWallet);
        }
        catch {
            toast.error("切换失败");
        }
        finally {
            setState({
                switching: false,
            });
        }
    }

    const value = useMemo(() => ({
        ...state,
        wallets: [...state.wallets].concat(eip6963.map(e => ({
            name: e.info.name,
            icon: e.info.icon,
            exists: true,
            async connect() {
                const provider = new BrowserProvider(e.provider);
                const [accounts, network] = await Promise.all([
                    provider.send("eth_requestAccounts", []),
                    provider.getNetwork(),
                ]);
                const balance = await provider.getBalance(accounts[0]);
                // await window.ethereum.request({method: "eth_requestAccounts"})
                return {
                    provider,
                    account: accounts[0],
                    balance,
                    value: formatEther(balance).replace(/(?<=\.\d{2})(\d*)/, ''),
                    network,
                };
            },
            async switchNetwork(network) {
                await e.provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: network.chainId === 11155111n ? "0x1" : '0xaa36a7' }],
                });
            },
        }))),
        openModal,
        closeModal,
        connectWallet,
        disconnect,
        switchNetwork,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [state]);

    useMount(() => {
        if (!config.autoReconnect) {
            return;
        }
        const currentWalletName = localStorage.getItem(currentWalletStorageKey);
        if (!currentWalletName)
            return;
        const wallet = state.wallets.find(wal => wal.name === currentWalletName);
        if (!wallet) {
            return;
        }
        connectWallet(wallet);
    });

    useEffect(() => {
        localStorage.setItem(currentWalletStorageKey, state.currentWallet?.name || "");
    }, [state.currentWallet]);

    useEffect(() => {
        const unlisten = attactWallet((providers) => {
            setEip6963(providers);
        });
        return () => {
            unlisten();
        };
    }, []);

    return (
        <>
            <ConnectContext.Provider value={value}>
                {children}
            </ConnectContext.Provider>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#4ade80',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </>
    );
}