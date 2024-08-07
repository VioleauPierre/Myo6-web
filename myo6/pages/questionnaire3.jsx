import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

//import "@fontsource/poppins";

import Footer from '../components/Footer'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import { Component } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { data } from 'autoprefixer'

export default function Home(props) {
  let baseUrl = "s";
  if (props.DEBUG_MODE === 'true') {
    baseUrl = "http://localhost:3000/";
    console.log("DEBUG_MODE");
  } else {
    baseUrl = "https://myo6.vercel.app/";
    console.log(baseUrl);
  }

  const [users, setUsers] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);
  const [Date2, setDate2] = useState('');
  const [selectedOptionSleepQuality, setSelectedOptionSleepQuality] = useState(-1);
  const [selectedOptionTrainLastDay, setSelectedOptionTrainLastDay] = useState(-1);
  const [selectedOptionTrainPerf, setSelectedOptionTrainPerf] = useState(0);
  const [selectedOptionPhysCond, setSelectedOptionPhysCond] = useState(0);
  const [selectedOptionStress, setSelectedOptionStress] = useState(0);
  const [selectedOptionMuscleSore, setSelectedOptionMuscleSore] = useState(0);
  const [selectedOptionFatigueSubj, setSelectedOptionFatigueSubj] = useState(0);
  const [selectedOptionInjuried, setSelectedOptionInjuried] = useState(0);
  const [selectedOptionAlcohol, setSelectedOptionAlcohol] = useState(0);
  const [selectedOptionMenstruation, setSelectedOptionMenstruation] = useState(0);
  const [selectedOptionTravel, setSelectedOptionTravel] = useState(0);
  const [selectedOptionSickness, setSelectedOptionSickness] = useState(0);

  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedAsleepTime, setSelectedAsleepTime] = useState('');
  const [selectedWakeupTime, setSelectedWakeupTime] = useState('');

  const [selectedUserGender, setSelectedUserGender] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  
  
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


  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedValue(selectedOption);
    setDate2(new Date().toISOString().split('T')[0]);
    console.log(selectedOption);
    const selectedUser = users.find(user => user.id_user === parseInt(selectedOption, 10));
    if (selectedUser) {
      setSelectedUserGender(selectedUser.sex);
    } else {
      setSelectedUserGender(''); // Réinitialiser le genre si aucun utilisateur n'est trouvé
    }
    console.log(selectedUserGender);
  };

  useEffect(() => {
    getUser()
  }, []);


  const isFormValid = () => {
    if (
      selectedOptionSleepQuality === -1 ||
      selectedOptionStress === -1 ||
      selectedOptionMuscleSore === -1 ||
      selectedOptionFatigueSubj === -1
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


    
    // let date = new Date();
    // let date1 = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
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

    const url_upload_form = 'https://myo6.duckdns.org/upload/form';
    const data_form = {
      "id_user": selectedValue,
      "date_record":Date2,
    //"date_record": "2024-03-27",
      "sleep_quality": sleepQuality,
      // "asleep_time": "23:15",
      // "wakeup_time": "07:35",
      "asleep_time": selectedAsleepTime,
      "wakeup_time": selectedWakeupTime,
      "weight": parseFloat(selectedWeight),
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
      <Header></Header>

      <div className="h-screen w-screen">
        <Navbar></Navbar>
        <hr className="w-full h-[4px] bg-beige"></hr>
        <div className='flex h-[calc(100%-84px)] '>
          {/* <SideBar></SideBar> */}
          <div id="main_code" className="h-fit w-full bg-gray-300">
            {/* ... (code existant pour le formulaire) */}


            <div className="w-full p-2 ">
              <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-fit">
                <div className="text-xl font-bold text-[#082431]">
                  Questionnaire
                </div>
              </div>
            </div>

            <div className="sm:flex">
            <div className="text-sm sm:text-lg font-bold text-[#082431] pl-4">
              Utilisateur : 
            

            <select value={selectedValue} onChange={handleSelectChange} className="bg-white rounded-lg m-4 w-auto shadow-xl border-2 border-gray-400 text-sm sm:text-lg">
            <option value="">Sélectionner un utilisateur</option>
              {users.map(user => (
                <option key={user.id_user} value={user.id_user}>
                  {user.firstname} {user.lastname}
                </option>
              ))}
            </select>
            </div>


            <div className="text-sm sm:text-lg font-bold text-[#082431] pl-4">
              Date : 
            

              <input className="bg-white rounded-lg m-4 w-auto shadow-xl border-2 border-gray-400 text-sm sm:text-lg"
        type="date"
        id="date"
        name="date"
        value={Date2}
        onChange={(e) => setDate2(e.target.value)}
      />
            </div>

            </div>


            <div className="pl-2 text-sm sm:text-lg">
*Champs Obligatoires
</div>


            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Avez vous bu de l&apos;alcool hier ? </p>

                  <div className="pt-3 flex justify-center items-center justify-items-center text-center">

                    <input
                      type="radio"
                      id="optionName-1"
                      name="optionName"
                      value="-1"
                      checked={selectedOptionAlcohol === '-1'}
                      onChange={(e) => setSelectedOptionAlcohol(e.target.value)}
                    />
                    <label htmlFor="optionName-1">Réinitialiser</label>

                  <input
                    type="radio"
                    id="alcohol0"
                    name="alcohol"
                    value="0"
                    checked={selectedOptionAlcohol === '0'}
                    onChange={(e) => setSelectedOptionAlcohol(e.target.value)}
                  />
                  <label htmlFor="alcohol0">Non</label>


                  {"  "}
                  <input
                    type="radio"
                    id="alcohol1"
                    name="alcohol"
                    value="1"
                    checked={selectedOptionAlcohol === '1'}
                    onChange={(e) => setSelectedOptionAlcohol(e.target.value)}
                  />
                  <label htmlFor="alcohol1">Oui, 1 ou 2 verres</label>


                  {"  "}
                  <input
                    type="radio"
                    id="alcohol2"
                    name="alcohol"
                    value="2"
                    checked={selectedOptionAlcohol === '2'}
                    onChange={(e) => setSelectedOptionAlcohol(e.target.value)}
                  />
                  <label htmlFor="alcohol2">Oui, plus de 2 verres</label>

                  </div>

                </form>

              </div>
            </div>


            {selectedUserGender === 'F' && (


            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Etes vous actuellement en période menstruelle ? </p>

                  <div className="pt-3 flex justify-center items-center justify-items-center text-center">

                  <input
                    type="radio"
                    id="menstruation1"
                    name="menstruation"
                    value="1"
                    checked={selectedOptionMenstruation === '1'}
                    onChange={(e) => setSelectedOptionMenstruation(e.target.value)}
                  />
                  <label htmlFor="menstruation1">Oui</label>


                  {"  "}
                  <input
                    type="radio"
                    id="menstruation0"
                    name="menstruation"
                    value="0"
                    checked={selectedOptionMenstruation === '0'}
                    onChange={(e) => setSelectedOptionMenstruation(e.target.value)}
                  />
                  <label htmlFor="menstruation0">Non</label>

                  </div>

                </form>

              </div>
            </div>
)
}

{selectedUserGender === 'M' && setSelectedOptionMenstruation === '0'}          


<div className="flex w-full p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              {errorMessage && <div className="bg-red-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{errorMessage}</div>}
              {submissionMessage && <div className="bg-green-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{submissionMessage}</div>}
            </div>

            <div className="flex w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-sky-600 text-center text-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
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