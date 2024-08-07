import React, { useRef } from 'react';

function ArduinoComponent() {
  const serialPort = useRef(null);

  const connectToArduino = async () => {
    try {
      // Demander l'accès au port série
      const port = await navigator.serial.requestPort();

      // Ouvrir la connexion avec le port série
      await port.open({ baudRate: 9600 });

      // Enregistrer la référence au port série
      serialPort.current = port;

      console.log('Connecté à l\'Arduino');
    } catch (error) {
      console.error('Erreur lors de la connexion à l\'Arduino :', error);
    }
  };

  const handleButtonClick = async () => {
    try {
      // Vérifier si le port série est déjà connecté
      if (serialPort.current) {
        // Envoyer le caractère "1" à l'Arduino
        const writer = serialPort.current.writable.getWriter();
        await writer.write(new Uint8Array([49])); // 49 est le code ASCII pour "1"
        writer.releaseLock();

        console.log('Données envoyées à l\'Arduino');
      } else {
        // Connecter au port série si ce n'est pas déjà fait
        await connectToArduino();

        // Puis envoyer les données
        handleButtonClick();
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de données à l\'Arduino :', error);
    }
  };

  return <button onClick={handleButtonClick}>Allumer les LED</button>;
}

export default ArduinoComponent;