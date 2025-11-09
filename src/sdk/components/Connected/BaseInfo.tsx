import { useBalance, useAccount, useDisconnect } from '@/sdk/context';
import cls from 'classnames';
import { Copy, Unplug } from 'lucide-react';
import toast from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styles from './index.module.scss';

const BaseInfo = () => {
    const { value } = useBalance();
    const { account } = useAccount();
    const disconnect = useDisconnect();
    const accountString = account?.replace(/^(.{4}).*(.{4})$/, '$1...$2');

    function copySuccess() {
        toast.success("复制成功");
    }

    return (
        <div className={cls('flex text-white rounded-xl overflow-hidden w-fit hover:scale-[1.03] cursor-pointer', styles.btn)}>
            <div className='px-4 h-10 leading-10 bg-[#2468f2]'>{value} ETH</div>
            <div className='px-4 h-10 leading-10 bg-[#2468f299] flex items-center'>
                {accountString} <CopyToClipboard
                    text={account}
                    onCopy={copySuccess}>
                    <Copy className='ml-3 w-4' />
                </CopyToClipboard>
                <Unplug
                    className='ml-3 w-4'
                    onClick={disconnect} />
            </div>
        </div>
    );
};

export default BaseInfo;