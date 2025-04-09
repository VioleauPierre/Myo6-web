import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import { useEffect, useState } from 'react';

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState('');
  const [city, setCity] = useState('');
  const [role] = useState('commotion');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [autoId, setAutoId] = useState(null);
  const [manualId, setManualId] = useState('');

  const isFormValid = () => {
    return firstName && lastName && birthDate && sex && city;
  };

  const getNextUserId = async () => {
    try {
      const res = await fetch('https://myo6.duckdns.org/api/get_user_list_com');
      const data = await res.json();
      const users = data.ID_list || [];
      const usedIds = users.map((u) => u.id_user).filter((id) => typeof id === 'number');

      const [min, max] = city === 'Montpellier' ? [219, 299] : [300, 399];

      for (let i = min; i <= max; i++) {
        if (!usedIds.includes(i)) {
          return i;
        }
      }

      throw new Error('Aucun ID disponible dans cette plage.');
    } catch (err) {
      console.error(err);
      setErrorMessage("Erreur lors de l'attribution de l'ID utilisateur.");
      return null;
    }
  };

  useEffect(() => {
    if (!city) {
      setAutoId(null);
      return;
    }

    getNextUserId().then((id) => {
      setAutoId(id);
    });
  }, [city]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid()) {
      setErrorMessage('Veuillez remplir tous les champs');
      return;
    }

    const finalId = manualId ? parseInt(manualId) : autoId;
    if (!finalId || isNaN(finalId)) {
      setErrorMessage("ID invalide ou non disponible.");
      return;
    }

    setErrorMessage('');

    const data_form = {
      firstname: firstName,
      lastname: lastName,
      password: '12345',
      role: role,
      birthdate: birthDate,
      sex: sex,
      id_user: finalId,
    };

    try {
      const response = await fetch('https://myo6.duckdns.org/api/create_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data_form),
      });

      if (response.ok) {
        setSubmissionMessage(`Utilisateur créé avec succès (ID: ${finalId})`);
      } else {
        setErrorMessage("Erreur lors de la création de l'utilisateur.");
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage("Erreur lors de la création de l'utilisateur.");
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
              <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center">
                <div className="text-xl font-bold text-[#082431]">Création de compte</div>
              </div>
            </div>

            {/* Prénom */}
            <div className="w-full sm:w-1/2 p-2 mx-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-between items-center">
                <p>Prénom :</p>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Saisissez votre prénom"
                  style={{ width: '190px' }}
                />
              </div>
            </div>

            {/* Nom */}
            <div className="w-full sm:w-1/2 p-2 mx-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-between items-center">
                <p>Nom :</p>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Saisissez votre nom"
                  style={{ width: '190px' }}
                />
              </div>
            </div>

            {/* Date de naissance */}
            <div className="w-full sm:w-1/2 p-2 mx-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-between items-center">
                <p>Date de naissance :</p>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
            </div>

            {/* Sexe */}
            <div className="w-full sm:w-1/2 p-2 mx-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-between items-center">
                <p>Sexe :</p>
                <div>
                  <input
                    type="radio"
                    id="sexM"
                    name="sex"
                    value="M"
                    checked={sex === 'M'}
                    onChange={(e) => setSex(e.target.value)}
                  />
                  <label htmlFor="sexM" className="mr-4">Homme</label>

                  <input
                    type="radio"
                    id="sexF"
                    name="sex"
                    value="F"
                    checked={sex === 'F'}
                    onChange={(e) => setSex(e.target.value)}
                  />
                  <label htmlFor="sexF">Femme</label>
                </div>
              </div>
            </div>

            {/* Ville */}
            <div className="w-full sm:w-1/2 p-2 mx-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-between items-center">
                <p>Ville :</p>
                <div>
                  <input
                    type="radio"
                    id="montpellier"
                    name="city"
                    value="Montpellier"
                    checked={city === 'Montpellier'}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <label htmlFor="montpellier" className="mr-4">Montpellier</label>

                  <input
                    type="radio"
                    id="perpignan"
                    name="city"
                    value="Perpignan"
                    checked={city === 'Perpignan'}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <label htmlFor="perpignan">Perpignan</label>
                </div>
              </div>
            </div>

            {/* ID attribué automatiquement */}
            {city && (
              <div className="w-full sm:w-1/2 p-2 mx-auto">
                <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-between items-center">
                  <p>ID attribué automatiquement :</p>
                  <input
                    type="text"
                    value={autoId ?? 'Chargement...'}
                    readOnly
                    className="bg-gray-100 text-center w-28 rounded border"
                  />
                </div>
              </div>
            )}

            {/* ID manuel optionnel */}
            <div className="w-full sm:w-1/2 p-2 mx-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-between items-center">
                <p>Forcer un ID utilisateur (optionnel) :</p>
                <input
                  type="number"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  placeholder="ex: 221"
                  className="text-center w-28 border rounded"
                />
              </div>
            </div>

            {/* Message d'erreur ou succès */}
            <div className="flex w-full p-2 justify-center items-center">
              {errorMessage && (
                <div className="bg-red-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">
                  {errorMessage}
                </div>
              )}
              {submissionMessage && (
                <div className="bg-green-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">
                  {submissionMessage}
                </div>
              )}
            </div>

            {/* Bouton soumettre */}
            <div className="flex w-1/2 p-2 mx-auto justify-center">
              <div className="flex bg-sky-600 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">
                <button onClick={handleSubmit}>Créer mon compte</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
