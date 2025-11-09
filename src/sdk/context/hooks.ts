import { useContext } from 'react';
import { ConnectContext } from './base';

export function useOpenModal() {
    const { openModal } = useContext(ConnectContext);
    return openModal;
}

export function useCloseModal() {
    const { closeModal } = useContext(ConnectContext);
    return closeModal;
}

export function useConnect() {
    const { connectWallet } = useContext(ConnectContext);
    return connectWallet;
}
export function useDisconnect() {
    const { disconnect } = useContext(ConnectContext);
    return disconnect;
}

export function useBalance() {
    const { balance, value } = useContext(ConnectContext);
    return { balance, value };
}
export function useAccount() {
    const { account } = useContext(ConnectContext);
    return { account };
}

export function useNetwork() {
    const { network, switching, switchNetwork } = useContext(ConnectContext);
    return { network, switching, switchNetwork };
}