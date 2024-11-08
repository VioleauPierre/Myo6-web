import { useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

export default function Home() {

  // State for test function inputs
  const [userId, setUserId] = useState('');
  const [sensorId, setSensorId] = useState('');
  const [testSubmissionMessage, setTestSubmissionMessage] = useState('');

  // Test function to submit userId and sensorId
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
      {/* <div className="scrollable-content"> */}
      <div className="h-screen w-screen">
        <Navbar></Navbar>
        <hr className="w-full h-[4px] bg-beige"></hr>
        <div className='flex  min-h-[calc(100%-68px)] bg-gray-300 h-auto '>
          {/* <SideBar></SideBar> */}
          <div id="main_code" className="h-full  w-full ">
            <div className="w-full p-2 ">
              <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-fit">
                <div className="text-xl font-bold text-[#082431]">
                  Enregistrement empreinte
                </div>
              </div>
            </div>

            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">

            <p>ID Utilisateur : </p>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Entrez l'ID de l'utilisateur"
              className="ml-2 w-full"
            />
          </div>

          {/* Sensor ID Field */}
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

          <div className="flex w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-sky-600 text-center text-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
          <button
            onClick={handleTestFunctionSubmit}
          >
            Envoyer les données de test
          </button>
          </div>
          </div>
          {/* Submission Message */}
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