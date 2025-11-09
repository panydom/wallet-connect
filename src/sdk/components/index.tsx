import { useContext } from 'react';
import Connect from './Button';
import Dialog from './Dialog';
import Connected from './Connected';
import { ConnectContext, ConnectStatus } from '../context';

function ConnectButton() {
    const { connectStatus } = useContext(ConnectContext);
    if (connectStatus !== ConnectStatus.CONNECTED) {
        return (
            <>
                <Connect loading={connectStatus === ConnectStatus.CONNECTING} />
                <Dialog />
            </>
        );
    }
    return <Connected />;
}

export default ConnectButton;
