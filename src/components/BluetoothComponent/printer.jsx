import React, { useState } from 'react';
import { BluetoothDevice } from 'react-web-bluetooth';

const BluetoothComponent = () => {
  const [device, setDevice] = useState(null);

  const handleConnect = () => {
    if (!navigator.bluetooth) {
        console.log('Bluetooth is not available in this browser.');
        return;
      }
    BluetoothDevice.requestDevice({
      filters: [{ services: ['printer'] }],
    })
      .then((device) => {
        setDevice(device);
        console.log('Connected to', device);
      })
      .catch((error) => {
        console.log('Error connecting to device:', error);
      });
  };

  return (
    <div>
      <button onClick={handleConnect}>Connect to Bluetooth Device</button>
      {device && <p>Connected to: {device.name}</p>}
    </div>
  );
};

export default BluetoothComponent;
