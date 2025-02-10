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
  const [mode, setMode] = useState(''); // Variable d'état pour le mode sélectionné

  // Fonction pour générer les informations Wi-Fi en QR Code
  const handleGenerateQR = () => {
    const wifiCredentials = `WIFI:T:${encryption};S:${ssid};P:${password};H:;`;
    return wifiCredentials;
  };

  // Fonction pour envoyer les paramètres au serveur
  const handleSendToServer = async () => {
    const url = 'https://myo6.duckdns.org/api/wifi_update'; // Remplacez par l'URL du serveur réel
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
            {/* Bloc d'information conditionnel */}
            {!mode && (
              <div className="w-full p-2 mb-4">
                <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center">
                  <div className="text-xl font-bold text-[#082431]">
                    Informations importantes :
                  </div>
                </div>
                <div className="p-4 bg-white border-2 border-gray-400 rounded-lg shadow-lg">
                  <p>
                    Choisissez l&apos;une des options suivantes :
                  </p>
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Générer un QR Code :</strong> Si vous souhaitez générer un QR Code pour
                        connecter le capteur à un réseau wi-fi.
                      </li>
                      <li>
                        <strong>Entrer un nouveau réseau (Ne fonctionne que si le capteur est déjà connecté à un réseau):</strong> Si vous souhaitez entrer un nouveau réseau
                        Wi-Fi pour un capteur via le serveur.
                      </li>
                    </ul>
                  
                </div>
              </div>
            )}

            {/* Sélecteur du mode */}
            <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-full">
                <p>Choisissez une option:</p>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  style={{ width: '190px' }}
                >
                  <option value="">Sélectionner</option>
                  <option value="generateQR">Générer QR Code</option>
                  <option value="enterNetwork">Entrer nouveau réseau</option>
                </select>
              </div>
            </div>

            {/* Message de guidage en fonction du mode sélectionné */}
            {mode === 'generateQR' && (
              <div className="w-full p-2 mb-4">
                <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center">
                  <div className="text-xl font-bold text-[#082431]">
                    Générer un QR Code Wi-Fi
                  </div>
                </div>
                <div className="p-4 bg-white border-2 border-gray-400 rounded-lg shadow-lg">
                  <p>
                    Pour générer un QR Code Wi-Fi, entrez les informations suivantes :
                    <ul className="list-disc pl-5">
                      <li><strong>SSID</strong> : Le nom du réseau Wi-Fi.</li>
                      <li><strong>Mot de passe</strong> : Le mot de passe de votre réseau.</li>
                      <li><strong>Type de cryptage</strong> : Choisissez le type de sécurité utilisé par votre réseau (WPA, WEP, etc.). Le plus courant est le WPA</li>
                      <li><strong>Etape 1</strong> : Renseigner les différents champs.</li>
                      <li><strong>Etape 2</strong> : Approcher le capteur avec la caméra face au QR Code.</li>
                      <li><strong>Etape 3</strong> : Appuyer sur le bouton noir pour déclencher la procédure de détection du QR Code. L&apos;anneau de LED clignote bleu foncé pendant la procédure</li>
                      <li><strong>A savoir</strong> : Il est parfois nécessaire d&apos;éteindre et rallumer le réseau ainsi que le capteur pour que la connexion s&apos;effectue</li>
                    </ul>
                  </p>
                </div>
              </div>
            )}

            {mode === 'enterNetwork' && (
              <div className="w-full p-2 mb-4">
                <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center">
                  <div className="text-xl font-bold text-[#082431]">
                    Entrer un nouveau réseau Wi-Fi
                  </div>
                </div>
                <div className="p-4 bg-white border-2 border-gray-400 rounded-lg shadow-lg">
                  <p>
                    Pour entrer un nouveau réseau Wi-Fi pour un capteur, fournissez les informations suivantes :
                    <ul className="list-disc pl-5">
                      <li><strong>ID Capteur</strong> : L&apos;identifiant unique de votre capteur.</li>
                      <li><strong>SSID</strong> : Le nom du réseau Wi-Fi.</li>
                      <li><strong>Mot de passe</strong> : Le mot de passe du réseau.</li>
                      <li><strong>Type de cryptage</strong> : Le type de sécurité du réseau (WPA, WEP, etc.).</li>
                      <li><strong>Etape 1</strong> : S&apos;asurer que le capteur est déjà connecté à un réseau.</li>
                      <li><strong>Etape 2</strong> : Renseigner les différents champs.</li>
                      <li><strong>Etape 3</strong> : Appuyer sur envoyer les paramètres au serveur. Si le message Success s&apos;affiche les paramètres sont bien renseignés sur le serveur.</li>
                      <li><strong>Etape 4</strong> : Appuyer sur le bouton noir pour permettre au capteur de récupérer les paramètres du réseau via le serveur.</li>
                      <li><strong>Etape 5</strong> : Une fois les LED redevenues statiques, couper l&apos;ancien réseau wi-fi et redémarrer le capteur pour qu&apos;il se connecte au réseau nouvellement ajouté.</li>
                    </ul>
                  </p>
                </div>
              </div>
            )}

            {/* Affichage des champs et du QR Code selon le mode */}
            {mode === 'generateQR' && (
              <>
                {/* SSID */}
                <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
                  <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-full">
                    <p>SSID:</p>
                    <input
                      type="text"
                      value={ssid}
                      onChange={(e) => setSsid(e.target.value)}
                      placeholder="Saisissez le SSID"
                      style={{ width: '190px' }}
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
                  <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-full">
                    <p>Mot de passe:</p>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Saisissez le mot de passe"
                      style={{ width: '190px' }}
                    />
                  </div>
                </div>

                {/* Type de cryptage */}
                <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
                  <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-full">
                    <p>Type de cryptage:</p>
                    <select
                      value={encryption}
                      onChange={(e) => setEncryption(e.target.value)}
                      style={{ width: '190px' }}
                    >
                      <option value="">Sélectionner</option>
                      <option value="WPA">WPA</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Aucun</option>
                    </select>
                  </div>
                </div>

                {/* Affichage du QR Code */}
                <div className="w-fit p-2 justify-center items-center ml-auto mr-auto">
                  <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-full">
                    <QRCode value={handleGenerateQR()} />
                  </div>
                </div>
              </>
            )}

            {mode === 'enterNetwork' && (
              <>
                {/* ID Capteur */}
                <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
                  <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-full">
                    <p>ID Capteur:</p>
                    <input
                      type="number"
                      value={sensorId}
                      onChange={(e) => setSensorId(e.target.value)}
                      placeholder="Entrez l'ID du capteur"
                      style={{ width: '190px' }}
                    />
                  </div>
                </div>

                {/* SSID */}
                <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
                  <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-full">
                    <p>SSID:</p>
                    <input
                      type="text"
                      value={ssid}
                      onChange={(e) => setSsid(e.target.value)}
                      placeholder="Saisissez le SSID"
                      style={{ width: '190px' }}
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
                  <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-full">
                    <p>Mot de passe:</p>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Saisissez le mot de passe"
                      style={{ width: '190px' }}
                    />
                  </div>
                </div>

                {/* Type de cryptage */}
                <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
                  <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center h-full">
                    <p>Type de cryptage:</p>
                    <select
                      value={encryption}
                      onChange={(e) => setEncryption(e.target.value)}
                      style={{ width: '190px' }}
                    >
                      <option value="">Sélectionner</option>
                      <option value="WPA">WPA</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Aucun</option>
                    </select>
                  </div>
                </div>

                {/* Envoi des paramètres au serveur */}
                <div className="w-fit p-2 justify-center items-center ml-auto mr-auto">
                  <button
                    onClick={handleSendToServer}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                  >
                    Envoyer les paramètres au serveur
                  </button>
                </div>
              </>
            )}

            {/* Réponse du serveur */}
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

export default Home;
