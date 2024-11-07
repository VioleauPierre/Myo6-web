// import withAuth from '../components/withAuth';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';

function Home() {
  const [sensorId, setSensorId] = useState('');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('');
  const [serverResponse, setServerResponse] = useState('');

  // Function to generate Wi-Fi credentials for QR Code
  const handleGenerateQR = () => {
    const wifiCredentials = `WIFI:T:${encryption};S:${ssid};P:${password};H:;`;
    return wifiCredentials;
  };

  // Function to handle the POST request
  const handleSendToServer = async () => {
    const url = 'https://myo6.duckdns.org/api/wifi_update'; // Replace with the actual server URL
    const data = {
      sensor_id: sensorId,
      ssid: ssid,
      password: password,
      encryption: encryption
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        setServerResponse(`Success: ${JSON.stringify(jsonResponse)}`);
      } else {
        setServerResponse(`Error: ${response.statusText}`);
      }
    } catch (error) {
      setServerResponse(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Header />
      <div className="h-screen w-screen">
        <Navbar />
        <hr className="w-full h-[4px] bg-beige" />
        <div className="flex min-h-[calc(100%-68px)] bg-gray-300 h-auto">
          <div id="main_code" className="h-full w-full">
            <div className="w-full p-2">
              <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-fit">
                <div className="text-xl font-bold text-[#082431]">
                  Générateur de QR Code Wi-Fi
                </div>
              </div>
            </div>

            {/* Sensor ID Field */}
            <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-full">
                <p> ID Capteur: </p>
                <input
                  type="number"
                  value={sensorId}
                  onChange={(e) => setSensorId(e.target.value)}
                  placeholder="Entrez l'ID du capteur"
                  style={{ width: '190px' }}
                />
              </div>
            </div>

            {/* SSID Field */}
            <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-full">
                <p> SSID: </p>
                <input
                  type="text"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  placeholder="Saisissez votre réponse"
                  style={{ width: '190px' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-full">
                <p> Mot de passe : </p>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Saisissez votre réponse"
                  style={{ width: '190px' }}
                />
              </div>
            </div>

            {/* Encryption Type Dropdown */}
            <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-full">
                <p> Type de cryptage: </p>
                <select
                  id="encryption"
                  value={encryption}
                  onChange={(e) => setEncryption(e.target.value)}
                >
                  <option value="">Sélectionner</option>
                  <option value="WPA">WPA</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Aucun</option>
                </select>
              </div>
            </div>

            {/* QR Code Display */}
            <div className="w-fit p-2 justify-center items-center ml-auto mr-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-full">
                <QRCode value={handleGenerateQR()} />
              </div>
            </div>

            {/* Send to Server Button */}
            <div className="w-fit p-2 justify-center items-center ml-auto mr-auto">
              <button
                onClick={handleSendToServer}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
              >
                Envoyer les paramètres au serveur
              </button>
            </div>

            {/* Server Response Display */}
            {serverResponse && (
              <div className="w-full p-2 text-center text-red-500">
                {serverResponse}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

Home.displayName = 'Home';

// export default withAuth(Home);
export default Home;