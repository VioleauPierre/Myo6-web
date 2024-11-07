import withAuth from '../components/withAuth';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';


 
function Home(props) {

    let baseUrl = "s";
    if (props.DEBUG_MODE === 'true') {
      baseUrl = "http://localhost:3000/";
      console.log("DEBUG_MODE");
    } else {
      baseUrl = "https://myo6-web.vercel.app/";
      console.log(baseUrl);
    }
    const [userList, setUserList] = useState([]); // État pour stocker la liste des utilisateurs
    const [selectedUserId, setSelectedUserId] = useState(''); // État pour l'ID sélectionné
    const [serialNumber, setSerialNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Récupérer la liste des utilisateurs depuis l'API au chargement du composant
    const fetchUserList = async () => {
      try {
        const response = await fetch('https://myo6.duckdns.org/api/get_user_list_euromov');
        if (response.ok) {
          const data = await response.json();
          setUserList(data.ID_list); // Mettre à jour la liste des utilisateurs
        } else {
          console.error('Erreur lors de la récupération de la liste des utilisateurs');
          setErrorMessage('Erreur lors de la récupération de la liste des utilisateurs');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setErrorMessage('Une erreur s\'est produite lors de la récupération de la liste des utilisateurs');
      }
    };

    fetchUserList();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!serialNumber || !email || !password || !selectedId) {
      setErrorMessage('Veuillez remplir tous les champs');
      return;
    }

    setErrorMessage('');
    setSubmissionMessage('');

    try {
      // Associer l'appareil avec l'ID sélectionné
      await associateDevice(selectedId);
      setSubmissionMessage('Association réussie !');
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Une erreur s\'est produite lors du processus');
    }
  }

  return (
    <>
      <Header />
      <div className="h-screen w-screen">
        <Navbar />
        <hr className="w-full h-[4px] bg-beige" />

        <div className='flex min-h-[calc(100%-84px)] bg-gray-300 h-auto'>
          <div id="main_code" className="h-full w-full">
            <div className="w-full p-2">
              <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center">
                <div className="text-xl font-bold text-[#082431]">
                  Accès Data
                </div>
              </div>
            </div>

            <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
              <div className="bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2">
                <p> Liste des utilisateurs : </p>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  style={{ width: '300px', textAlign: 'center' }}
                >
                  <option value="">-- Choisir un utilisateur --</option>
                  {userList.map(user => (
                    <option key={user.id_user} value={user.id_user}>
                      {user.firstname} {user.lastname} (ID: {user.id_user})
                    </option>
                  ))}
                </select>
              </div>
            </div>

          

              <div className="flex w-full p-2 justify-center items-center ml-auto mr-auto">
              {errorMessage && <div className="bg-red-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{errorMessage}</div>}
              {submissionMessage && <div className="bg-green-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{submissionMessage}</div>}
            </div>

            {/* <div className="flex w-1/2 p-2 justify-center items-center ml-auto mr-auto">
              <button onClick={handleSubmit} className="bg-sky-600 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">
                Démarrer l'association
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  console.log(process.env.DEBUG_MODE);
  return {
    props: { DEBUG_MODE: process.env.DEBUG_MODE },
  };
}

Home.displayName = 'Home';

export default withAuth(Home);