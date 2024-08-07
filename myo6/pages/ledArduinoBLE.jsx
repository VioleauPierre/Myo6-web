import React, { useState } from 'react';

function ArduinoBluetoothControl() {
  const [device, setDevice] = useState(null);
  const [ledState, setLedState] = useState(false);

  const connectToArduino = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['arduino_led_service'] }],
      });
      setDevice(device);
    } catch (error) {
      console.error('Error connecting to Arduino:', error);
    }
  };

  const toggleLEDs = async () => {
    if (!device) {
      return;
    }

    try {
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('arduino_led_service');
      const characteristic = await service.getCharacteristic('led_control');
      await characteristic.writeValue(new Uint8Array([ledState ? 0 : 1]));
      setLedState(!ledState);

      // Éteindre les LED après 10 secondes
      setTimeout(() => {
        characteristic.writeValue(new Uint8Array([0]));
        setLedState(false);
      }, 10000);
    } catch (error) {
      console.error('Error sending value:', error);
    }
  };

  return (
    <div>
      <button onClick={connectToArduino}>Connect to Arduino</button>
      <button onClick={toggleLEDs}>Toggle LEDs</button>
    </div>
  );
}

export default ArduinoBluetoothControl;