import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

export default function Home() {
  const [userList, setUserList] = useState([]);
  const [filteredUserList, setFilteredUserList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [sensorId, setSensorId] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('phase2'); // Default to phase 2
  const [testSubmissionMessage, setTestSubmissionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch user list on component mount
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await fetch('https://myo6.duckdns.org/api/get_user_list_euromov');
        if (response.ok) {
          const data = await response.json();
          setUserList(data.ID_list);
        } else {
          setErrorMessage('Erreur lors de la récupération de la liste des utilisateurs');
        }
      } catch (error) {
        setErrorMessage('Une erreur s\'est produite lors de la récupération de la liste des utilisateurs');
      }
    };
    
    fetchUserList();
  }, []);

  // Filter users based on selected phase
  useEffect(() => {
    if (selectedPhase === 'phase1') {
      setFilteredUserList(userList.filter(user => user.role === 'euromov'));
    } else if (selectedPhase === 'phase2') {
      setFilteredUserList(userList.filter(user => user.role === 'euromov_p2'));
    } else {
      setFilteredUserList([]);
    }
    // Reset selected user when phase changes
    setSelectedUserId('');
  }, [selectedPhase, userList]);

  const handleTestFunctionSubmit = async (event) => {
    event.preventDefault();

    if (!selectedUserId || !sensorId) {
      setTestSubmissionMessage('Veuillez remplir tous les champs (User ID et Sensor ID).');
      return;
    }

    const testEndpointUrl = 'https://myo6.duckdns.org/api/new_finger_record';
    const testData = {
      id_user: parseInt(selectedUserId),
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
      <Header />
      <div className="h-screen w-screen">
        <Navbar />
        <hr className="w-full h-[4px] bg-beige" />
        <div className="flex min-h-[calc(100%-68px)] bg-gray-300 h-auto">
          <div id="main_code" className="h-full w-full">
            {/* Instructions section */}
            <div className="w-full p-4 bg-white rounded-lg shadow-md border border-gray-300 mb-4">
              <h2 className="text-xl font-bold text-[#082431] mb-2">
                Instructions pour l&apos;utilisateur
              </h2>
              <p className="text-gray-700 mb-2">
                Veuillez suivre les étapes ci-dessous :
              </p>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Sélectionnez la <strong>phase</strong> du projet (Phase 1 ou Phase 2).</li>
                <li>Sélectionnez un <strong>utilisateur</strong> dans la liste déroulante.</li>
                <li>Ajoutez l&apos;<strong>ID Capteur</strong> dans le dernier champ.</li>
                <li>Si vous avez terminé, cliquez sur le bouton <strong>&quot;Envoyer&quot;</strong> pour valider vos données.</li>
                <li>Vérifiez que le capteur est bien connecté à un réseau en surveillant votre partage de connexion</li>
                <li>Appuyer sur le <strong>bouton BLEU</strong> pour les capteurs 4 à 6 ou <strong>bouton Noir + de 2 secondes</strong> pour le capteur 3 (l&apos;anneau de LED passe en orange clignotant) pour entrer dans le mode association</li>
                <li>Posez le doigt à enregistrer sur le capteur d&apos;empreinte jusqu&apos;à ce que l&apos;anneau de LED change de couleur</li>
              </ul>
            </div>

            <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
              {/* Phase selection with radio buttons */}
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center">
                <div className="flex items-center space-x-6">
                  <p className="font-semibold mr-4">Phase : </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="phase1"
                      name="phase"
                      value="phase1"
                      checked={selectedPhase === 'phase1'}
                      onChange={(e) => setSelectedPhase(e.target.value)}
                      className="form-radio h-4 w-4"
                    />
                    <label htmlFor="phase1" className="cursor-pointer">Phase 1</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="phase2"
                      name="phase"
                      value="phase2"
                      checked={selectedPhase === 'phase2'}
                      onChange={(e) => setSelectedPhase(e.target.value)}
                      className="form-radio h-4 w-4"
                    />
                    <label htmlFor="phase2" className="cursor-pointer">Phase 2</label>
                  </div>
                </div>
              </div>

              {/* User selection dropdown */}
              <div className="bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2">
                <p className="mb-2 font-semibold">Sélectionnez un utilisateur :</p>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full max-w-md p-2 border rounded"
                >
                  <option value="">-- Choisir un utilisateur --</option>
                  {filteredUserList.map(user => (
                    <option key={user.id_user} value={user.id_user}>
                      {user.firstname} {user.lastname} (ID: {user.id_user})
                    </option>
                  ))}
                </select>
                {filteredUserList.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Aucun utilisateur disponible pour cette phase
                  </p>
                )}
              </div>

              {/* Sensor ID input */}
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

              {/* Submit button */}
              <div className="flex w-1/2 p-2 justify-center items-center ml-auto mr-auto">
                <button
                  onClick={handleTestFunctionSubmit}
                  className="bg-sky-600 text-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 w-full"
                >
                  Envoyer
                </button>
              </div>

              {/* Status messages */}
              {testSubmissionMessage && (
                <div
                  className={`text-white rounded-lg p-2 mt-4 ${
                    testSubmissionMessage.includes('succès') ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {testSubmissionMessage}
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-500 text-white rounded-lg p-2 mt-4">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}