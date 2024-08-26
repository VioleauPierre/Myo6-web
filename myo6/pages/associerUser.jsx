import Header from '../components/Header'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'

import { useEffect } from 'react'
import { useState } from 'react'

export default function Home(props) {

  let baseUrl = "s";
  if (props.DEBUG_MODE === 'true') {
    baseUrl = "http://localhost:3000/";
    console.log("DEBUG_MODE");
  } else {
    baseUrl = "https://myo6-web.vercel.app/";
    console.log(baseUrl);
  }

  const [serialNumber, setSerialNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isFormValid = () => {
    return serialNumber && email && password;
  };

  const getUserId = async () => {
    try {
      const response = await fetch('https://myo6.duckdns.org/api/get_user_data_table');
      if (response.ok) {
        const users = await response.json();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          return user.id_user;
        } else {
          setErrorMessage('Adresse e-mail ou mot de passe incorrect');
          return null;
        }
      } else {
        throw new Error('Erreur lors de la récupération des données utilisateur');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Une erreur s\'est produite lors de la récupération des données utilisateur');
      return null;
    }
  };

  const associateDevice = async (userId) => {
    const url_upload_form = 'https://myo6.duckdns.org/api/associate';
    const data_form = {
      'id_user': userId,
      'serial_number': serialNumber
    };
    console.log('Données à envoyer:', data_form);

    try {
      const response = await fetch(url_upload_form, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data_form),
      });

      if (response.ok) {
        setSubmissionMessage('L\'association peut commencer sur le Myo6');
      } else {
        setErrorMessage('Une erreur s\'est produite verifier le numero de série du Myo6');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Une erreur s\'est produite lors de l\'association');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid()) {
      setErrorMessage('Veuillez remplir tous les champs');
      return;
    }
  
    setErrorMessage('');
    setSubmissionMessage('');

    try {
      const userId = await getUserId();
      if (!userId) {
        setErrorMessage('Impossible de récupérer l\'ID de l\'utilisateur');
        return;
      }
      await associateDevice(userId);
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Une erreur s\'est produite lors du processus');
    }
  }

  

  return (
    <>
      <Header></Header>
      <div className="h-screen w-screen">
        <Navbar></Navbar>
        <hr className="w-full h-[4px] bg-beige"></hr>
      
        <div className='flex  min-h-[calc(100%-84px)] bg-gray-300 h-auto '>
          {/* <SideBar></SideBar> */}
          <div id="main_code" className="h-full  w-full ">


          <div className="w-full p-2 ">
              <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-fit">
                <div className="text-xl font-bold text-[#082431]">
                  Associer votre empreinte
                </div>
              </div>
            </div>

            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className=" bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">


      <p> Saisissez le numéro de série du Myo6 : </p>
  
      <input
        type="text"
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
        placeholder="Numéro de série"
        style={{ width: '190px',
          textAlign: 'center' }}
      />
    </div>
    </div>

    <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className=" bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">


      <p> Adresse mail : </p>
  
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Adresse mail"
        style={{ width: '190px',
          textAlign: 'center' }}
      />
    </div>
    </div>

            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className=" bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">


      <p> Mot de passe : </p>
  
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        style={{ width: '190px',
          textAlign: 'center' }}
      />
    </div>
    </div>

    <div className="flex w-full p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              {errorMessage && <div className="bg-red-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{errorMessage}</div>}
              {submissionMessage && <div className="bg-green-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{submissionMessage}</div>}
            </div>


            <div className="flex w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-sky-600 text-center text-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
            <button onClick={handleSubmit}>Démarrer l&apos;association</button>
            </div>
            </div>
          </div>
        </div>
       
      
          
      </div>
    </>
  )
}
export async function getServerSideProps() {
  // fetch env.local variables named DEBUG_MODE
console.log(process.env.DEBUG_MODE);
  return {
    props: { DEBUG_MODE: process.env.DEBUG_MODE },
  };
}