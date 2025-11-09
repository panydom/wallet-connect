import { BrowserProvider, formatEther } from 'ethers';

import type { Wallet, ConnectResponse } from './types';

const metaMask: Wallet = {
    name: 'MetaMask',
    icon: 'https://cdn.iconscout.com/icon/free/png-512/metamask-2728406-2261817.png',
    get exists() {
        return typeof window.ethereum !== 'undefined';
    },
    connectText: "连接到MetaMask",
    async connect() {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new BrowserProvider(window.ethereum);
            const [accounts, network] = await Promise.all([
                provider.send("eth_requestAccounts", []),
                provider.getNetwork(),
            ]);
            const balance = await provider.getBalance(accounts[0]);
            console.log(network);
            // await window.ethereum.request({method: "eth_requestAccounts"})
            return {
                provider,
                account: accounts[0],
                balance,
                value: formatEther(balance).replace(/(?<=\.\d{2})(\d*)/, ''),
                network,
            };
        } else {
            throw new Error(`未检测到${metaMask.name}`);
        }
    },
    async switchNetwork(network: ConnectResponse['network']) {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: network.chainId === 11155111n ? "0x1" : '0xaa36a7' }],
        });
    },
};

export default metaMask;