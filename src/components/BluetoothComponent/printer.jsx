import React, { useState } from 'react';

const BluetoothPrinter = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Function to connect to the Bluetooth printer
  const connectToPrinter = async () => {
    try {
      setIsPrinting(true);

      // Request Bluetooth device with optional services
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true, // Accept all devices
        optionalServices: ['0000180f-0000-1000-8000-00805f9b34fb'], // Add your required service UUID
      });

      // Connect to the printer
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('0000180f-0000-1000-8000-00805f9b34fb'); // Ensure the correct UUID is provided
      const characteristic = await service.getCharacteristic('00002a19-0000-1000-8000-00805f9b34fb'); // Replace with actual characteristic UUID

      // Printer initialized successfully
      setIsConnected(true);

      // Send data to the printer (Example text: "Hello, Printer!")
      const encoder = new TextEncoder();
      const text = encoder.encode("Hello, Printer!\n");
      await characteristic.writeValue(text);

      // Optionally, add more commands (e.g., line feed, cut paper)
      const lineFeed = new TextEncoder().encode('\x0A'); // New line command
      await characteristic.writeValue(lineFeed);

      setIsPrinting(false);
    } catch (error) {
      console.error('Error connecting to Bluetooth printer:', error);
      setIsPrinting(false);
    }
  };

  return (
    <div>
      <h1>Bluetooth Printer</h1>
      <button
        onClick={connectToPrinter}
        disabled={isPrinting || isConnected}
      >
        {isPrinting ? 'Printing...' : isConnected ? 'Connected to Printer' : 'Connect to Printer'}
      </button>
    </div>
  );
};

export default BluetoothPrinter;
