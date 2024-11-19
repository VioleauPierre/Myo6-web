import Image from 'next/image'
import styles from '@/styles/Home.module.css'

//import "@fontsource/poppins";

import { Component } from 'react'
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

  const [users, setUsers] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [Date2, setDate2] = useState('');
  const [selectedOptionSleepQuality, setSelectedOptionSleepQuality] = useState('');
  const [selectedOptionTrainLastDay, setSelectedOptionTrainLastDay] = useState('');
  const [selectedOptionTrainPerf, setSelectedOptionTrainPerf] = useState('');
  const [selectedOptionPhysCond, setSelectedOptionPhysCond] = useState('');
  const [selectedOptionStress, setSelectedOptionStress] = useState('');
  const [selectedOptionMuscleSore, setSelectedOptionMuscleSore] = useState('');
  const [selectedOptionFatigueSubj, setSelectedOptionFatigueSubj] = useState('');
  const [selectedOptionInjuried, setSelectedOptionInjuried] = useState('');
  const [selectedOptionAlcohol, setSelectedOptionAlcohol] = useState('');
  const [selectedOptionMenstruation, setSelectedOptionMenstruation] = useState('');
  const [selectedOptionTravel, setSelectedOptionTravel] = useState('');
  const [selectedOptionSickness, setSelectedOptionSickness] = useState('');
  const [rmssdLying, setRmssdLying] = useState('');
  const [lnrmssdLying, setLnrmssdLying] = useState('');
  const [lfLying, setLfLying] = useState('');
  const [hfLying, setHfLying] = useState('');
  const [rmssdStanding, setRmssdStanding] = useState('');
  const [lnrmssdStanding, setLnrmssdStanding] = useState('');
  const [lfStanding, setLfStanding] = useState('');
  const [hfStanding, setHfStanding] = useState('');
  const [fcr, setFcr] = useState('');
  const [recoveryState, setRecoveryState] = useState(50);

  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedAsleepTime, setSelectedAsleepTime] = useState('');
  const [selectedWakeupTime, setSelectedWakeupTime] = useState('');
  const [selectedSleepDuration, setSelectedSleepDuration] = useState('');

  const [selectedUserGender, setSelectedUserGender] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');



  async function setVar() {
    setSelectedOptionSleepQuality(null);
    setSelectedOptionTrainLastDay(null);
    setSelectedOptionTrainPerf(null);
    setSelectedOptionPhysCond(null);
    setSelectedOptionStress(null);
    setSelectedOptionMuscleSore(null);
    setSelectedOptionFatigueSubj(null);
    setSelectedOptionInjuried('0');
    setSelectedOptionAlcohol('0');
    setSelectedOptionMenstruation(null);
    setSelectedOptionTravel('0');
    setSelectedOptionSickness('0');
    setRmssdLying('');
    setLnrmssdLying('');
    setLfLying('');
    setHfLying('');
    setRmssdStanding('');
    setLnrmssdStanding('');
    setLfStanding('');
    setHfStanding('');
    setFcr('');
    setRecoveryState(50);
    setSelectedWeight('');
    setSelectedAsleepTime('');
    setSelectedWakeupTime('');
    setSelectedSleepDuration('');
    setDate2(new Date().toISOString().split('T')[0])
  }

  useEffect(() => {
    setVar()
  }, []);
  
  async function getUser() {

    const res = await fetch(baseUrl + 'api/getAllUser', {
    //const res = await fetch('http://localhost:3000/api/getUsers_Test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    console.log(data);
    setUsers(data);


  }

  async function findUser() {
    const selectedOption = window.location.href.split("=")[1];
    setSelectedValue(selectedOption);
    setDate2(new Date().toISOString().split('T')[0]);
    console.log(selectedOption);
    const selectedUser = users.find(user => user.id_user === parseInt(selectedOption, 10));
    console.log(selectedUser);
    if (selectedUser) {
      setSelectedUserGender(selectedUser.sex);
    } else {
      setSelectedUserGender(''); // Reset gender if no user is found
    }
    console.log(selectedUserGender);
    clearMessages();
  };

  useEffect(() => {
    findUser();
  }, [selectedValue, users]);

  useEffect(() => {
    getUser()
  }, []);


  const isFormValid = () => {
    if (
      !selectedOptionSleepQuality ||
      !selectedOptionStress ||
      !recoveryState
    ) {
      return false;
    }
    return true;
  };


  const handleDateChange = (e) => {
    setDate2(e.target.value);
    clearMessages();
  };


  const clearMessages = () => {
    setSubmissionMessage('');
    setErrorMessage('');
  };





  const handleSubmit = async (event) => {
    event.preventDefault();
    clearMessages();

    if (!isFormValid()) {
        setErrorMessage('Veuillez remplir tous les champs');
        return;
    }

    setErrorMessage('');

    // Convert values
    const sleepQuality = parseInt(selectedOptionSleepQuality, 10);
    const trainLastDay = parseInt(selectedOptionTrainLastDay, 10);
    const trainPerf = parseInt(selectedOptionTrainPerf, 10);
    const physCond = parseInt(selectedOptionPhysCond, 10);
    const stress = parseInt(selectedOptionStress, 10);
    const muscleSore = parseInt(selectedOptionMuscleSore, 10);
    const fatigueSubj = parseInt(selectedOptionFatigueSubj, 10);
    const injuried = parseInt(selectedOptionInjuried, 10);
    const alcohol = parseInt(selectedOptionAlcohol, 10);
    const menstruation = parseInt(selectedOptionMenstruation, 10);
    const travel = parseInt(selectedOptionTravel, 10);
    const sickness = parseInt(selectedOptionSickness, 10);
    const weight = parseFloat(selectedWeight);
    const sleeptime = selectedSleepDuration;
    const rmssdl = parseFloat(rmssdLying);
    const lnrmssdl = parseFloat(lnrmssdLying);
    const lfl = parseFloat(lfLying);
    const hfl = parseFloat(hfLying);
    const rmssds = parseFloat(rmssdStanding);
    const lnrmssds = parseFloat(lnrmssdStanding);
    const lfs = parseFloat(lfStanding);
    const hfs = parseFloat(hfStanding);

    const url_upload_form = 'https://myo6.duckdns.org/upload/form';
    const data_form = {
        "id_user": selectedValue,
        "date_record": Date2,
        "sleep_quality": sleepQuality,
        "asleep_time": selectedAsleepTime,
        "wakeup_time": selectedWakeupTime,
        "sleep_time": sleeptime,
        "weight": weight,
        "rmssd_lying": rmssdl,
        "lnrmssd_lying": lnrmssdl,
        "lf_lying": lfl,
        "hf_lying": hfl,
        "rmssd_standing": rmssds,
        "lnrmssd_standing": lnrmssds,
        "lf_standing": lfs,
        "hf_standing": hfs,
        "hr_rest": parseInt(fcr, 10),
        "prs_100": parseInt(recoveryState, 10),
        "train_lastday": trainLastDay,
        "train_perf": trainPerf,
        "phys_cond": physCond,
        "stress": stress,
        "muscle_sore": muscleSore,
        "fatigue_subj": fatigueSubj,
        "injuried": injuried,
        "alcohol": alcohol,
        "menstruation": menstruation,
        "travel": travel,
        "sickness": sickness
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
            setSubmissionMessage('Le questionnaire a été envoyé avec succès.');

            // Delay for 1 second before resetting the form
            setTimeout(() => {
                setVar(); // Call the setVar function to reset the form
            }, 1000);

        } else {
            setErrorMessage('Une erreur s\'est produite lors de l\'envoi du questionnaire');
        }
    } catch (error) {
        console.error('Erreur:', error);
        setErrorMessage('Une erreur s\'est produite lors de l\'envoi du questionnaire');
    }
};




  return (
    <>
      <div className="h-screen w-screen">
        <div className='flex  min-h-[calc(100%-84px)] bg-gray-900 h-auto '>

          <div id="main_code" className="h-full  w-full ">

            <div className="sm:flex">
            <div className="text-white sm:text-lg font text-md pl-4">
              Date : 
            

              <input className="bg-gray-300 rounded-lg m-4 w-auto shadow-xl border-2 border-gray-300 text-gray-900 sm:text-lg"
                type="date"
                id="date"
                name="date"
                value={Date2}
                onChange={handleDateChange}
              />
            </div>

            </div>


            <div className="pl-2 text-gray-300 sm:text-lg">
*Champs Obligatoires
</div>


{/* Section Sommeil */}
<div className="w-full sm:w-1/2 max-w-5xl p-4 mx-auto flex flex-col items-center">
  <div className="bg-gray-100 text-sm sm:text-lg text-center rounded-lg shadow-xl border-4 border-bleugris p-4 w-full h-full">
    <h2 className="text-lg sm:text-xl font-bold mb-4">Sommeil</h2>

    {/* Bloc "À quelle heure vous êtes-vous endormi(e) hier soir ?" */}
    <div className="mb-4 w-full flex flex-col items-center">
      <h3 className="text-base sm:text-lg font-semibold mb-2">À quelle heure vous êtes-vous endormi(e) hier soir ?</h3>
      <input
        type="time"
        id="heure"
        name="heure"
        value={selectedAsleepTime}
        onChange={(e) => setSelectedAsleepTime(e.target.value)}
        className="bg-white rounded-lg p-2 w-40 text-center"
      />
    </div>

    {/* Bloc "À quelle heure vous êtes-vous réveillé(e) ce matin ?" */}
    <div className="mb-4 w-full flex flex-col items-center">
      <h3 className="text-base sm:text-lg font-semibold mb-2">À quelle heure vous êtes-vous réveillé(e) ce matin ?</h3>
      <input
        type="time"
        id="heure"
        name="heure"
        value={selectedWakeupTime}
        onChange={(e) => setSelectedWakeupTime(e.target.value)}
        className="bg-white rounded-lg p-2 w-40 text-center"
      />
    </div>

    {/* Bloc "Temps de sommeil (en heures) :" */}
    <div className="mb-4 w-full flex flex-col items-center">
      <h3 className="text-base sm:text-lg font-semibold mb-2">Temps de sommeil (en heures) :</h3>
      <input
        type="time"
        id="sleepDuration"
        name="sleepDuration"
        value={selectedSleepDuration}
        onChange={(e) => setSelectedSleepDuration(e.target.value)}
        className="bg-white rounded-lg p-2 w-40 text-center"
      />
    </div>

    {/* Bloc "Quelle est votre qualité de sommeil ?" */}
    <div className="w-full">
      <h3 className="text-base sm:text-lg font-semibold mb-2">Quelle est votre qualité de sommeil ?*</h3>
      <div className="flex justify-center items-center text-center">
        <div className="pr-3 text-xs sm:text-lg">Excellent</div>

        {/* Radio buttons for sleep quality */}
        {[...Array(7)].map((_, index) => (
          <div key={index} className="flex items-center mx-1">
            <input
              type="radio"
              id={`quality${index + 1}`}
              name="sleep_quality"
              value={index + 1}
              checked={selectedOptionSleepQuality === String(index + 1)}
              onChange={(e) => setSelectedOptionSleepQuality(e.target.value)}
              className="mx-1"
            />
            <label htmlFor={`quality${index + 1}`} className="text-sm">{index + 1}</label>
          </div>
        ))}

        <div className="pl-3 text-xs sm:text-lg">Très mauvais</div>
      </div>
    </div>
  </div>
</div>






{/* Section Données Cardiaques */}
<div className="w-full sm:w-1/2 max-w-5xl p-4 mx-auto flex flex-col items-center">
  <div className="flex flex-col bg-gray-100 text-sm sm:text-lg text-center rounded-lg shadow-xl border-4 border-bleugris p-4 w-full h-full min-h-[330px]">
    <h2 className="text-lg sm:text-xl font-bold mb-4">Données cardiaques</h2>

    {/* Bloc Fréquence et variabilité cardiaque allongé */}
    <div className="w-full mb-4">
      <h3 className="text-base sm:text-lg font-semibold mb-2">Fréquence et variabilité cardiaque allongé</h3>
      <div className="pt-3 flex flex-wrap justify-between">
        {[
          { id: 'rmssdl', label: 'RMSSD', value: rmssdLying, setValue: setRmssdLying },
          { id: 'lnrmssdl', label: 'LnRMSSD', value: lnrmssdLying, setValue: setLnrmssdLying },
          { id: 'lfl', label: 'LF', value: lfLying, setValue: setLfLying },
          { id: 'hfl', label: 'HF', value: hfLying, setValue: setHfLying },
          { id: 'fcr', label: 'FC Repos', value: fcr, setValue: setFcr },
        ].map(({ id, label, value, setValue }) => (
          <div key={id} className="w-1/5 px-2">
            <label htmlFor={id} className="block text-base">{label}</label>
            <input
              type="number"
              id={id}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              step="0.01"
              className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
            />
          </div>
        ))}
      </div>
    </div>

    {/* Bloc Fréquence et variabilité cardiaque debout */}
    <div className="w-full mb-4">
      <h3 className="text-base sm:text-lg font-semibold mb-2">Fréquence et variabilité cardiaque debout</h3>
      <div className="pt-3 flex flex-wrap justify-between">
        {[
          { id: 'rmssds', label: 'RMSSD', value: rmssdStanding, setValue: setRmssdStanding },
          { id: 'lnrmssds', label: 'LnRMSSD', value: lnrmssdStanding, setValue: setLnrmssdStanding },
          { id: 'lfs', label: 'LF', value: lfStanding, setValue: setLfStanding },
          { id: 'hfs', label: 'HF', value: hfStanding, setValue: setHfStanding },
        ].map(({ id, label, value, setValue }) => (
          <div key={id} className="w-1/5 px-2">
            <label htmlFor={id} className="block text-base">{label}</label>
            <input
              type="number"
              id={id}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              step="0.01"
              className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
</div>





{/* Section Stress & Courbatures */}
<div className="w-full sm:w-1/2 max-w-5xl p-4 mx-auto flex flex-col items-center">
  <div className="flex flex-col bg-gray-100 text-sm sm:text-lg text-center rounded-lg shadow-xl border-4 border-bleugris p-4 w-full h-full">
    <p className="text-xl font-semibold mb-4">Stress & Courbatures</p>

    {/* Bloc Stress */}
    <div className="w-full p-2">
      <p className="text-lg font-medium">Quel est votre niveau de stress ce matin ?*</p>
      <form>
        <div className="pt-3 flex justify-center items-center text-center pl-8">
          <div className="pr-3 text-xs sm:text-lg">Pas stressé</div>
          {[...Array(7)].map((_, index) => {
            const value = (index + 1).toString();
            return (
              <div key={value} className="flex items-center mx-1">
                <input
                  type="radio"
                  id={`stress${value}`}
                  name="stress"
                  value={value}
                  checked={selectedOptionStress === value}
                  onChange={(e) => setSelectedOptionStress(e.target.value)}
                />
                <label htmlFor={`stress${value}`}>{value}</label>
              </div>
            );
          })}
          <div className="pl-3 text-xs sm:text-lg">Très stressé</div>
        </div>
      </form>
    </div>

    {/* Ligne de séparation */}
    <div className="my-4 w-full border-t border-gray-300"></div>

    {/* Bloc Courbatures */}
    <div className="w-full p-2">
      <p className="text-lg font-medium">Comment évaluez-vous votre niveau de douleurs musculaires/courbatures ce matin ?*</p>
      <form>
        <div className="pt-3 flex justify-center items-center text-center pl-8">
          <div className="pr-3 text-xs sm:text-lg">Aucune</div>
          {[...Array(7)].map((_, index) => {
            const value = (index + 1).toString();
            return (
              <div key={value} className="flex items-center mx-1">
                <input
                  type="radio"
                  id={`sore${value}`}
                  name="muscle_sore"
                  value={value}
                  checked={selectedOptionMuscleSore === value}
                  onChange={(e) => setSelectedOptionMuscleSore(e.target.value)}
                />
                <label htmlFor={`sore${value}`}>{value}</label>
              </div>
            );
          })}
          <div className="pl-3 text-xs sm:text-lg">Extrêmement élevé</div>
        </div>
      </form>
    </div>
  </div>
</div>

{/* Section État de récupération */}
<div className="w-full sm:w-1/2 max-w-5xl p-4 mx-auto mt-4 flex flex-col items-center">
  <div className="flex flex-col bg-gray-100 text-sm sm:text-lg text-center rounded-lg shadow-xl border-4 border-bleugris p-4 w-full h-full">
    {/* Titre principal */}
    <p className="text-xl font-semibold mb-4">État de récupération</p>

    {/* Contenu */}
    <div className="pt-3 flex flex-col items-center">
      <div className="relative w-full">
        <input
          type="range"
          min="0"
          max="100"
          value={recoveryState}
          onChange={(e) => setRecoveryState(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between w-full px-1 mt-1">
          {[0, 20, 40, 60, 80, 100].map((value) => (
            <div key={value} className="flex flex-col items-center">
              <div className="h-3 w-0.5 bg-gray-300"></div>
              <span className="text-xs text-gray-500 mt-1">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 w-full mt-4 text-xs">
        <div className="text-center">Pas récupéré<br />Très fatigué</div>
        <div className="text-center">Peu récupéré<br />Fatigué</div>
        <div className="text-center">Moyennement<br />récupéré</div>
        <div className="text-center">Récupération<br />normale</div>
        <div className="text-center">Bonne récupération<br />Energique</div>
        <div className="text-center">Excellente récupération<br />Très énergique</div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-lg font-medium">Valeur: {recoveryState}</span>
      </div>
    </div>
  </div>
</div>



{/* Section Autres */}
<div className="w-full sm:w-1/2 max-w-5xl p-4 mx-auto flex flex-col items-center">
  <div className="flex flex-col bg-gray-100 text-sm sm:text-lg text-center rounded-lg shadow-xl border-4 border-bleugris p-4 w-full h-full">
    {/* Titre principal */}
    <p className="text-xl font-semibold mb-4">Autres</p>

{/* Bloc Quel est votre poids aujourd'hui ? */}
<div className="mb-4">
  <p className="text-lg font-medium mb-2">Quel est votre poids aujourd'hui ?</p>
  <input
    type="text"
    value={selectedWeight}
    onChange={(e) => setSelectedWeight(e.target.value)}
    placeholder="Saisissez votre réponse"
    className="w-full sm:w-72 p-3 border border-gray-300 rounded-lg text-center"  // Ajout de 'text-center'
  />
</div>



    {/* Ligne de séparation */}
    <div className="my-4 w-full border-t border-gray-300"></div>

    {/* Bloc Avez-vous une blessure ? */}
    <div className="mb-4">
      <p className="text-lg font-medium mb-2">Avez-vous une blessure ?</p>
      <div className="flex justify-center items-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            id="injuried1"
            name="injuried"
            value="1"
            checked={selectedOptionInjuried === '1'}
            onChange={(e) => setSelectedOptionInjuried(e.target.value)}
            className="mr-1"
          />
          Oui
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            id="injuried0"
            name="injuried"
            value="0"
            checked={selectedOptionInjuried === '0'}
            onChange={(e) => setSelectedOptionInjuried(e.target.value)}
            className="mr-1"
          />
          Non
        </label>
      </div>
    </div>

    {/* Ligne de séparation */}
    <div className="my-4 w-full border-t border-gray-300"></div>

    {/* Bloc Avez-vous bu de l'alcool hier ? */}
    <div className="mb-4">
      <p className="text-lg font-medium mb-2">Avez-vous bu de l'alcool hier ?</p>
      <div className="flex justify-center items-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            id="alcohol0"
            name="alcohol"
            value="0"
            checked={selectedOptionAlcohol === '0'}
            onChange={(e) => setSelectedOptionAlcohol(e.target.value)}
            className="mr-1"
          />
          Non
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            id="alcohol1"
            name="alcohol"
            value="1"
            checked={selectedOptionAlcohol === '1'}
            onChange={(e) => setSelectedOptionAlcohol(e.target.value)}
            className="mr-1"
          />
          Oui, 1 ou 2 verres
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            id="alcohol2"
            name="alcohol"
            value="2"
            checked={selectedOptionAlcohol === '2'}
            onChange={(e) => setSelectedOptionAlcohol(e.target.value)}
            className="mr-1"
          />
          Oui, plus de 2 verres
        </label>
      </div>
    </div>

    {/* Ligne de séparation */}
    <div className="my-4 w-full border-t border-gray-300"></div>

    {/* bloc Avez-vous effectué un trajet de plus de 2h hier ? */}
    <div className="mb-4">
      <p className="text-lg font-medium mb-2">Avez-vous effectué un trajet de plus de 2h hier ?</p>
      <div className="flex justify-center items-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            id="travel1"
            name="travel"
            value="1"
            checked={selectedOptionTravel === '1'}
            onChange={(e) => setSelectedOptionTravel(e.target.value)}
            className="mr-1"
          />
          Oui
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            id="travel0"
            name="travel"
            value="0"
            checked={selectedOptionTravel === '0'}
            onChange={(e) => setSelectedOptionTravel(e.target.value)}
            className="mr-1"
          />
          Non
        </label>
      </div>
    </div>

    {/* Ligne de séparation */}
    <div className="my-4 w-full border-t border-gray-300"></div>

    {/* Bloc Êtes-vous malade actuellement ? */}
    <div className="mb-4">
      <p className="text-lg font-medium mb-2">Êtes-vous malade actuellement ?</p>
      <div className="flex justify-center items-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            id="sickness1"
            name="sickness"
            value="1"
            checked={selectedOptionSickness === '1'}
            onChange={(e) => setSelectedOptionSickness(e.target.value)}
            className="mr-1"
          />
          Oui
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            id="sickness0"
            name="sickness"
            value="0"
            checked={selectedOptionSickness === '0'}
            onChange={(e) => setSelectedOptionSickness(e.target.value)}
            className="mr-1"
          />
          Non
        </label>
      </div>
    </div>

{/* Ligne de séparation (visible uniquement si le genre est féminin) */}
{selectedUserGender === 'F' && (
  <div className="my-4 w-full border-t border-gray-300"></div>
)}

{/* Bloc Êtes-vous actuellement en période menstruelle ? (pour les femmes) */}
{selectedUserGender === 'F' && (
  <div className="mb-4">
    <p className="text-lg font-medium mb-2">Êtes-vous actuellement en période menstruelle ?</p>
    <div className="flex justify-center items-center space-x-4">
      <label className="flex items-center">
        <input
          type="radio"
          id="menstruation1"
          name="menstruation"
          value="1"
          checked={selectedOptionMenstruation === '1'}
          onChange={(e) => setSelectedOptionMenstruation(e.target.value)}
          className="mr-1"
        />
        Oui
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          id="menstruation0"
          name="menstruation"
          value="0"
          checked={selectedOptionMenstruation === '0'}
          onChange={(e) => setSelectedOptionMenstruation(e.target.value)}
          className="mr-1"
        />
        Non
      </label>
    </div>
  </div>
)}

  </div>
</div>





            <div className="flex w-full p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              {errorMessage && <div className="bg-red-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{errorMessage}</div>}
              {submissionMessage && <div className="bg-green-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{submissionMessage}</div>}
            </div>

            <div className="flex w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-sky-600 text-center text-white rounded-lg shadow-xl border-2 mb-2 border-gray-900 p-2 justify-center items-center justify-items-center h-full">
            <button onClick={handleSubmit}>Envoyer</button>
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