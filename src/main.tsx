import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ConnectProvider, createConfig } from './sdk';
import { metaMask } from './sdk/wallets';

const config = createConfig({
  wallets: [metaMask],
  autoReconnect: true,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConnectProvider config={config}>
      <App />
    </ConnectProvider>
  </StrictMode>,
);
