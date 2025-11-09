import cls from 'classnames';

import { useNetwork } from '@/sdk/context';
import { ArrowRightLeft, LoaderCircle } from 'lucide-react';

const Network = () => {
    const { network, switching, switchNetwork } = useNetwork();
    return (
        <div
            className={cls(
                "flex items-center text-white rounded-xl overflow-hidden w-fit hover:scale-[1.03] cursor-pointer px-4 h-10 leading-10 bg-[#2468f2]",
                {
                    "bg-[#2468f2aa]": switching,
                },
            )}
            onClick={switchNetwork}>
            {
                switching ? (
                    <>
                        正在切换
                        <LoaderCircle className="animate-spin ml-3 w-4" />
                    </>
                ) : (
                    <>
                        {network?.name}
                        <ArrowRightLeft className='ml-3 w-4' />
                    </>
                )
            }
        </div>
    );
};

export default Network;