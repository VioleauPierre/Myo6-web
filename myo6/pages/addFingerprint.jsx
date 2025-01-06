import { useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

export default function Home() {
  const [userId, setUserId] = useState('');
  const [sensorId, setSensorId] = useState('');
  const [testSubmissionMessage, setTestSubmissionMessage] = useState('');

  const handleTestFunctionSubmit = async (event) => {
    event.preventDefault();

    if (!userId || !sensorId) {
      setTestSubmissionMessage('Veuillez remplir les champs User ID et Sensor ID.');
      return;
    }

    const testEndpointUrl = 'https://myo6.duckdns.org/api/new_finger_record'; // Replace with actual endpoint
    const testData = {
      id_user: parseInt(userId),
      id_sensor: parseInt(sensorId),
    };

    try {
      const response = await fetch(testEndpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      if (response.ok) {
        setTestSubmissionMessage('Données envoyées avec succès!');
      } else {
        setTestSubmissionMessage('Erreur lors de l\'envoi des données.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setTestSubmissionMessage('Erreur lors de l\'envoi des données.');
    }
  };

  return (
    <>
      <Header></Header>
      <div className="h-screen w-screen">
        <Navbar></Navbar>
        <hr className="w-full h-[4px] bg-beige"></hr>
        <div className="flex min-h-[calc(100%-68px)] bg-gray-300 h-auto">
          <div id="main_code" className="h-full w-full">
            {/* Section pour le texte explicatif */}
            <div className="w-full p-4 bg-white rounded-lg shadow-md border border-gray-300 mb-4">
              <h2 className="text-xl font-bold text-[#082431] mb-2">
                Instructions pour l&apos;utilisateur
              </h2>
              <p className="text-gray-700 mb-2">
                Veuillez suivre les étapes ci-dessous :
              </p>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Entrez l&apos;<strong>ID Utilisateur</strong> dans le champ prévu à cet effet.</li>
                <li>Ajoutez l&apos;<strong>ID Capteur</strong> dans le deuxième champ.</li>
                <li>Si vous avez terminé, cliquez sur le bouton <strong>"Envoyer"</strong> pour valider vos données.</li>
                <li>Vous recevrez un message de confirmation ou d&apos;erreur après l&apos;envoi.</li>
                <li>Vérifiez que <strong>le capteur est bien connecté à un réseau</strong> en appuyant sur le <strong>bouton rouge</strong>, si après quelques secondes l&apos;anneau de LED clignote en vert, le capteur est connecté</li>
                <li>Maintenez le <strong>bouton noir</strong> appuyé pendant + de 2 secondes (l&apos;anneau de LED passe en orange clignotant) pour entrer dans le mode association</li>
                <li>Posez le doigt à enregistrer sur le capteur d'empreinte jusqu'à ce que l&apos;anneau de LED change de couleur</li>
              </ul>
            </div>

            <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2">
                <p>ID Utilisateur : </p>
                <input
                  type="number"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Entrez l'ID de l'utilisateur"
                  className="ml-2 w-full"
                />
              </div>

              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-4 border-gray-400 p-4">
                <p>ID Capteur : </p>
                <input
                  type="number"
                  value={sensorId}
                  onChange={(e) => setSensorId(e.target.value)}
                  placeholder="Entrez l'ID du capteur"
                  className="ml-2 w-full"
                />
              </div>

              <div className="flex w-1/2 p-2 justify-center items-center ml-auto mr-auto">
                <button
                  onClick={handleTestFunctionSubmit}
                  className="bg-sky-600 text-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 w-full"
                >
                  Envoyer
                </button>
              </div>

              {testSubmissionMessage && (
                <div
                  className={`text-white rounded-lg p-2 mt-4 ${
                    testSubmissionMessage.includes('succès') ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {testSubmissionMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
