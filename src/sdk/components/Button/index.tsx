
import type { FC } from 'react';
import cls from 'classnames';
import { LoaderCircle } from 'lucide-react';
import styles from './Button.module.scss';
import { useOpenModal } from '@/sdk/context';

const ConnectButton: FC<{ loading: boolean }> = function ({ loading }) {

    const openModal = useOpenModal();

    return (
        <>
            <div
                className={cls([
                    "text-red-50",
                    "px-4 h-10 rounded-[20px]",
                    "leading-10",
                    "cursor-pointer",
                    "inline-flex items-center",
                    styles.btn,
                ])}
                onClick={openModal}
            >
                {
                    loading ? (
                        <>
                            <LoaderCircle className="animate-spin mr-2" />正在连接
                        </>
                    ) : "连接钱包"
                }
            </div>
        </>
    );
};

export default ConnectButton;