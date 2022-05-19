import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import React from 'react';
import Button from '@mui/material/Button';

export function ConnectSample() {
  const {
    status,
    network,
    wallets,
    availableConnectTypes,
    availableInstallTypes,
    availableConnections,
    supportFeatures,
    connect,
    install,
    disconnect,
  } = useWallet();

  return (
    <div>
      <h1>Connect Sample</h1>
      <section>
        <pre>
          {JSON.stringify(
            {
              status,
              network,
              wallets,
              supportFeatures: Array.from(supportFeatures),
              availableConnectTypes,
              availableInstallTypes,
            },
            null,
            2,
          )}
        </pre>
      </section>

      <footer>
        {status === WalletStatus.WALLET_NOT_CONNECTED && (
          <>
            {availableInstallTypes.map((connectType) => (
              <Button
                key={'install-' + connectType}
                onClick={() => install(connectType)}
              >
                Install {connectType}
              </Button>
            ))}
            {availableConnectTypes.map((connectType) => (
              <Button
                key={'connect-' + connectType}
                onClick={() => connect(connectType)}
              >
                Connect {connectType}
              </Button>
            ))}
            <br />
            {availableConnections.map(
              ({ type, name, icon, identifier = '' }) => (
                <Button
                  key={'connection-' + type + identifier}
                  onClick={() => connect(type, identifier)}
                >
                  <img
                    src={icon}
                    alt={name}
                    style={{ width: '1em', height: '1em' }}
                  />
                  {name} [{identifier}]
                </Button>
              ),
            )}
          </>
        )}
        {status === WalletStatus.WALLET_CONNECTED && (
          <Button onClick={() => disconnect()}>Disconnect</Button>
        )}
      </footer>
    </div>
  );
}
