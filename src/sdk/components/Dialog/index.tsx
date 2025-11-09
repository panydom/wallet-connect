import { useContext, useEffect, useState } from "react";
import cls from 'classnames';
import { LoaderCircle } from 'lucide-react';
import { ConnectContext } from '../../index';
import styles from './Dialog.module.scss';
import { useCloseModal, useConnect } from '@/sdk/context';
import type { Wallet } from '@/sdk/wallets';
import type { FC } from 'react';

const Dialog: FC = () => {
    const { modalVisible, wallets, currentWallet } = useContext(ConnectContext);
    const [connecting, setConnecting] = useState('');
    const [connectError, setConnectError] = useState('');
    const closeModal = useCloseModal();
    const connect = useConnect();
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    async function onConnect(wallet: Wallet) {
        try {
            setConnecting(wallet.name);
            await connect(wallet);
            setConnectError("");
            closeModal();
        }
        catch (e) {
            console.dir(e);
            setConnectError(wallet.name);
        }
        finally {
            setConnecting('');
        }
    }

    function renderWallet(wallet: Wallet) {
        return (
            <div
                key={wallet.name + wallet.icon}
                className={cls(styles.wallet, "flex px-4 py-2 items-center select-none")}
            >
                <img
                    src={wallet.icon}
                    className="w-8 h-8 mr-2" />
                <span className="flex-1">{wallet.name}</span>
                {
                    wallet.exists ? (
                        currentWallet?.name === wallet.name ? (
                            <div className="text-lime-600">已连接</div>
                        ) : (
                            connecting === wallet.name ? (
                                <div
                                    className="px-4 h-8 leading-8 bg-[#2468f2aa] text-sm text-white  hover:cursor-wait rounded-2xl flex items-center"
                                >
                                    <LoaderCircle className="animate-spin mr-2" />
                                    正在连接
                                </div>
                            ) : (
                                <div
                                    className="px-4 h-8 leading-8 bg-[#2468f2] text-sm text-white  hover:cursor-pointer rounded-2xl"
                                    onClick={() => onConnect(wallet)}>
                                    {connectError ? "重试" : (wallet.connectText || '连接钱包')}
                                </div>
                            )
                        )

                    ) : null
                }

            </div>
        );
    }

    useEffect(() => {
        if (modalVisible) {
            setShouldRender(true);
            setTimeout(() => {
                setIsVisible(true);
            }, 50);
        } else {
            setIsVisible(false);
            // 等待动画完成后再移除组件
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300); // 与CSS动画时间保持一致
            return () => clearTimeout(timer);
        }
    }, [modalVisible]);

    if (!shouldRender) {
        return null;
    }

    return (
        <div>
            <div
                className={cls(styles.overlay, { [styles.visible]: isVisible })}
                onClick={closeModal}></div>
            <div className={cls([styles.inner, 'py-4'], {
                [styles.visible]: isVisible,
            })}>
                {wallets.map(wallet => renderWallet(wallet))}
            </div>
        </div>
    );
};

export default Dialog;