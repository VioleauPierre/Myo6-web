import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

import Footer from '../components/Footer'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import { Component } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

export default function Home({  }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState(0);
  const [phase, setPhase] = useState('3');
  const [role, setRole] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sensorId, setSensorId] = useState('3');

  // Update role whenever phase changes
  useEffect(() => {
    if (phase === '1') {
      setRole('euromov');
    } else if (phase === '2') {
      setRole('euromov_p2');
    } else if (phase === '3') {
      setRole('commotion');
    }
  }, [phase]);

  const isFormValid = () => {
    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !sensorId ||
      !sex ||
      !phase
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid()) {
      setErrorMessage('Veuillez remplir tous les champs');
      return;
    }
  
    setErrorMessage('');

    let date = new Date();
    let date1 = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    const url_upload_form = 'https://myo6.duckdns.org/api/create_user';
    const data_form = {
      'firstname' : firstName,
      'lastname' : lastName,
      'password' : '12345',
      'role' : role,
      'birthdate' : birthDate,
      'sensor_id' : sensorId,
      'sex' : sex
    };
    console.log(data_form);

    try {
      const response = await fetch(url_upload_form, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data_form),
      });

      if (response.ok) {
        setSubmissionMessage('Utilisateur créé avec succès');
      } else {
        setErrorMessage('Une erreur s\'est produite lors de la création de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Une erreur s\'est produite lors de la création de l\'utilisateur');
    }
  };

  return (
    <>
      <Header></Header>
      <div className="h-screen w-screen">
        <Navbar></Navbar>
        <hr className="w-full h-[4px] bg-beige"></hr>
        <div className='flex  min-h-[calc(100%-68px)] bg-gray-300 h-auto '>
          <div id="main_code" className="h-full  w-full ">
            <div className="w-full p-2 ">
              <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-fit">
                <div className="text-xl font-bold text-[#082431]">
                  Création de compte
                </div>
              </div>
            </div>

            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                <p> Prénom : </p>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Saisissez votre réponse"
                  style={{ width: '190px' }}
                />
              </div>
            </div>

            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                <p> Nom : </p>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Saisissez votre réponse"
                  style={{ width: '190px' }}
                />
              </div>
            </div>

            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                <p>Date de naissance :</p>
                <input
                  type="date"
                  id="heure"
                  name="heure"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
            </div>
      
            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                <p> ID Capteur : </p>
                <input
                  type="number"
                  value={sensorId}
                  onChange={(e) => setSensorId(e.target.value)}
                  placeholder="Entrez l'ID du capteur"
                  style={{ width: '190px' }}
                />
              </div>
            </div>

            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                <form>
                  <p>Sexe : </p>
                  <input
                    type="radio"
                    id="sex1"
                    name="sex"
                    value="M"
                    checked={sex === 'M'}
                    onChange={(e) => setSex(e.target.value)}
                  />
                  <label htmlFor="sex1">Homme</label>

                  {"  "}
                  <input
                    type="radio"
                    id="sex2"
                    name="sex"
                    value="F"
                    checked={sex === 'F'}
                    onChange={(e) => setSex(e.target.value)}
                  />
                  <label htmlFor="sex2">Femme</label>
                </form>
              </div>
            </div>

            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                <form>
                  <p>Phase : </p>
                  <input
                    type="radio"
                    id="phase1"
                    name="phase"
                    value="1"
                    checked={phase === '1'}
                    onChange={(e) => setPhase(e.target.value)}
                  />
                  <label htmlFor="phase1">Phase 1</label>

                  {"  "}
                  <input
                    type="radio"
                    id="phase2"
                    name="phase"
                    value="2"
                    checked={phase === '2'}
                    onChange={(e) => setPhase(e.target.value)}
                  />
                  <label htmlFor="phase2">Phase 2</label>
                  {"  "}
                  <input
                    type="radio"
                    id="commotion"
                    name="phase"
                    value="3"
                    checked={phase === '3'}
                    onChange={(e) => setPhase(e.target.value)}
                  />
                  <label htmlFor="commotion">Commotion</label>
                </form>
              </div>
            </div>

            <div className="flex w-full p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              {errorMessage && <div className="bg-red-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{errorMessage}</div>}
              {submissionMessage && <div className="bg-green-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{submissionMessage}</div>}
            </div>

            <div className="flex w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-sky-600 text-center text-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                <button onClick={handleSubmit}>Créer mon compte</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}