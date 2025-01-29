import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

import './index.css';
import { PrivyProvider } from '@privy-io/react-auth';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <PrivyProvider
      appId="cm6b3u7z10005ldzhyymp6v7h"
      config={{
        loginMethods: ['email','wallet','google', 'discord', 'twitter'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://e7.pngegg.com/pngimages/419/810/png-clipart-recycling-symbol-recycling-codes-reuse-plastic-3r-glass-angle.png ',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <BrowserRouter> {/* Add BrowserRouter here */}
        <App />
      </BrowserRouter>
    </PrivyProvider>
  </React.StrictMode>,
);