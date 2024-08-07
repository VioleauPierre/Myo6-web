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
    setRmssdLying(null);
    setLnrmssdLying(null);
    setLfLying(null);
    setHfLying(null);
    setRmssdStanding(null);
    setLnrmssdStanding(null);
    setLfStanding(null);
    setHfStanding(null);
    setFcr(null);
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
    clearMessages();
  };

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
      "date_record":Date2,
    //"date_record": "2024-03-27",
      "sleep_quality": sleepQuality,
      // "asleep_time": "23:15",
      // "wakeup_time": "07:35",
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
        <div className='flex  min-h-[calc(100%-84px)] bg-gray-300 h-auto '>
          {/* <SideBar></SideBar> */}
          <div id="main_code" className="h-full  w-full ">


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
        onChange={handleDateChange}
      />
            </div>

            </div>


            <div className="pl-2 text-sm sm:text-lg">
*Champs Obligatoires
</div>


            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className=" bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">


      <p>Quel est votre poids aujourd&apos;hui ?</p>
      <input
        type="text"
        value={selectedWeight}
        onChange={(e) => setSelectedWeight(e.target.value)}
        placeholder="Saisissez votre réponse"
        style={{ width: '210px' }}
      />
    </div>
    </div>



<div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className=" bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">


      <p>À quelle heure vous êtes-vous endormi(e) hier soir ?</p>
      <input
        type="time"
        id="heure"
        name="heure"
        value={selectedAsleepTime}
        onChange={(e) => setSelectedAsleepTime(e.target.value)}
      />
    </div>
    </div>

    <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className=" bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">

  <p>À quelle heure vous êtes-vous réveillé(e) ce matin ?</p>
  <input
    type="time"
    id="heure"
    name="heure"
    value={selectedWakeupTime}
    onChange={(e) => setSelectedWakeupTime(e.target.value)}
  />
</div>
</div>

<div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
<div className=" bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">
    <p>Temps de sommeil (en heures) :</p>
      <input
        type="time"
        id="sleepDuration"
        name="sleepDuration"
        value={selectedSleepDuration}
        onChange={(e) => setSelectedSleepDuration(e.target.value)}
        className="bg-white rounded-lg m-2 w-30 text-sm sm:text-lg"
      />
    </div>
  </div>






{/* SLEEP QUALITY */}



            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Quelle est votre qualité de sommeil ?*</p>

                  <div className="pt-3 flex justify-center items-center justify-items-center text-center">
                  <div className="pr-3 text-xs sm:text-lg">
                    Excellent
                    </div>


                  <input
                    type="radio"
                    id="quality1"
                    name="sleep_quality"
                    value="1"
                    checked={selectedOptionSleepQuality === '1'}
                    onChange={(e) => setSelectedOptionSleepQuality(e.target.value)}
                  />
                  <label htmlFor="quality1">1</label>


                  {"  "}
                  <input
                    type="radio"
                    id="quality2"
                    name="sleep_quality"
                    value="2"
                    checked={selectedOptionSleepQuality === '2'}
                    onChange={(e) => setSelectedOptionSleepQuality(e.target.value)}
                  />
                  <label htmlFor="quality2">2</label>


                  {"  "}
                  <input
                    type="radio"
                    id="quality3"
                    name="sleep_quality"
                    value="3"
                    checked={selectedOptionSleepQuality === '3'}
                    onChange={(e) => setSelectedOptionSleepQuality(e.target.value)}
                  />
                  <label htmlFor="quality3">3</label>


                  {"  "}
                  <input
                    type="radio"
                    id="quality4"
                    name="sleep_quality"
                    value="4"
                    checked={selectedOptionSleepQuality === '4'}
                    onChange={(e) => setSelectedOptionSleepQuality(e.target.value)}
                  />
                  <label htmlFor="quality4">4</label>


                  {"  "}
                  <input
                    type="radio"
                    id="quality5"
                    name="sleep_quality"
                    value="5"
                    checked={selectedOptionSleepQuality === '5'}
                    onChange={(e) => setSelectedOptionSleepQuality(e.target.value)}
                  />
                  <label htmlFor="quality5">5</label>


                  {"  "}
                  <input
                    type="radio"
                    id="quality6"
                    name="sleep_quality"
                    value="6"
                    checked={selectedOptionSleepQuality === '6'}
                    onChange={(e) => setSelectedOptionSleepQuality(e.target.value)}
                  />
                  <label htmlFor="quality6">6</label>


                  {"  "}
                  <input
                    type="radio"
                    id="quality7"
                    name="sleep_quality"
                    value="7"
                    checked={selectedOptionSleepQuality === '7'}
                    onChange={(e) => setSelectedOptionSleepQuality(e.target.value)}
                  />
                  <label htmlFor="quality5">7</label>

                  <div className="pl-3 text-xs sm:text-lg">
                    Très mauvais
                    </div>
                  </div>



                </form>

              </div>
            </div>



<div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto">
  <div className="flex flex-col bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">
    <p>Fréquence et variabilité cardiaque allongé</p>
    
    <div className="pt-3 flex flex-wrap justify-between">
      <div className="w-1/5 px-2">
        <label htmlFor="rmssdl" className="block text-base">RMSSD</label>
        <input
          type="number"
          id="rmssdl"
          value={rmssdLying}
          onChange={(e) => setRmssdLying(e.target.value)}
          step="0.01"
          className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
        />
      </div>
      
      <div className="w-1/5 px-2">
        <label htmlFor="lnrmssdl" className="block text-base">LnRMSSD</label>
        <input
          type="number"
          id="lnrmssdl"
          value={lnrmssdLying}
          onChange={(e) => setLnrmssdLying(e.target.value)}
          step="0.01"
          className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
        />
      </div>
      
      <div className="w-1/5 px-2">
        <label htmlFor="lfl" className="block text-base">LF</label>
        <input
          type="number"
          id="lfl"
          value={lfLying}
          onChange={(e) => setLfLying(e.target.value)}
          step="0.01"
          className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
        />
      </div>
      
      <div className="w-1/5 px-2">
        <label htmlFor="hfl" className="block text-base">HF</label>
        <input
          type="number"
          id="hfl"
          value={hfLying}
          onChange={(e) => setHfLying(e.target.value)}
          step="0.01"
          className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
        />
      </div>

      <div className="w-1/5 px-2">
        <label htmlFor="fcr" className="block text-base">FC Repos</label>
        <input
          type="number"
          id="fcr"
          value={fcr}
          onChange={(e) => setFcr(e.target.value)}
          className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
        />
      </div>
    </div>
  </div>
</div>



<div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto">
  <div className="flex flex-col bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">
    <p>Fréquence et variabilité cardiaque debout</p>
    
    <div className="pt-3 flex flex-wrap justify-between">
      <div className="w-1/5 px-2">
        <label htmlFor="rmssds" className="block text-base">RMSSD</label>
        <input
          type="number"
          id="rmssds"
          value={rmssdStanding}
          onChange={(e) => setRmssdStanding(e.target.value)}
          step="0.01"
          className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
        />
      </div>
      
      <div className="w-1/5 px-2">
        <label htmlFor="lnrmssds" className="block text-base">LnRMSSD</label>
        <input
          type="number"
          id="lnrmssds"
          value={lnrmssdStanding}
          onChange={(e) => setLnrmssdStanding(e.target.value)}
          step="0.01"
          className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
        />
      </div>
      
      <div className="w-1/5 px-2">
        <label htmlFor="lfs" className="block text-base">LF</label>
        <input
          type="number"
          id="lfs"
          value={lfStanding}
          onChange={(e) => setLfStanding(e.target.value)}
          step="0.01"
          className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
        />
      </div>
      
      <div className="w-1/5 px-2">
        <label htmlFor="hfs" className="block text-base">HF</label>
        <input
          type="number"
          id="hfs"
          value={hfStanding}
          onChange={(e) => setHfStanding(e.target.value)}
          step="0.01"
          className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
        />
      </div>
    </div>
  </div>
</div>




<div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto">
  <div className="flex flex-col bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-4">
    <p>État de récupération*</p>
    
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


{/* STRESS LEVEL */}






            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Quel est votre niveau de stress ce matin ?* </p>

                  <div className="pt-3 flex justify-center items-center justify-items-center text-center pl-8">
                  <div className="pr-3 text-xs sm:text-lg">
                    Pas stressé
                    </div>
                    

                  <input
                    type="radio"
                    id="stress1"
                    name="stress"
                    value="1"
                    checked={selectedOptionStress === '1'}
                    onChange={(e) => setSelectedOptionStress(e.target.value)}
                  />
                  <label htmlFor="stress1">1</label>


                  {"  "}
                  <input
                    type="radio"
                    id="stress2"
                    name="stress"
                    value="2"
                    checked={selectedOptionStress === '2'}
                    onChange={(e) => setSelectedOptionStress(e.target.value)}
                  />
                  <label htmlFor="stress2">2</label>


                  {"  "}
                  <input
                    type="radio"
                    id="stress3"
                    name="stress"
                    value="3"
                    checked={selectedOptionStress === '3'}
                    onChange={(e) => setSelectedOptionStress(e.target.value)}
                  />
                  <label htmlFor="stress3">3</label>


                  {"  "}
                  <input
                    type="radio"
                    id="stress4"
                    name="stress"
                    value="4"
                    checked={selectedOptionStress === '4'}
                    onChange={(e) => setSelectedOptionStress(e.target.value)}
                  />
                  <label htmlFor="stress4">4</label>


                  {"  "}
                  <input
                    type="radio"
                    id="stress5"
                    name="stress"
                    value="5"
                    checked={selectedOptionStress === '5'}
                    onChange={(e) => setSelectedOptionStress(e.target.value)}
                  />
                  <label htmlFor="stress5">5</label>



                  {"  "}
                  <input
                    type="radio"
                    id="stress6"
                    name="stress"
                    value="6"
                    checked={selectedOptionStress === '6'}
                    onChange={(e) => setSelectedOptionStress(e.target.value)}
                  />
                  <label htmlFor="stress6">6</label>



                  {"  "}
                  <input
                    type="radio"
                    id="stress7"
                    name="stress"
                    value="7"
                    checked={selectedOptionStress === '7'}
                    onChange={(e) => setSelectedOptionStress(e.target.value)}
                  />
                  <label htmlFor="stress7">7</label>

                  <div className="pl-3 text-xs sm:text-lg">
                    Très stessé
                    </div>
                  </div>

                </form>

              </div>
            </div>




            

{/* MUSCLE SORENESS */}






            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Comment évaluez vous votre niveau de douleurs musculaires/courbatures ce matin ?* </p>

                  <div className="pt-3 flex justify-center items-center justify-items-center text-center pl-8">
                  <div className="pr-3 text-xs sm:text-lg">
                    Aucune
                    </div>

                  <input
                    type="radio"
                    id="sore1"
                    name="muscle_sore"
                    value="1"
                    checked={selectedOptionMuscleSore === '1'}
                    onChange={(e) => setSelectedOptionMuscleSore(e.target.value)}
                  />
                  <label htmlFor="sore1">1</label>


                  {"  "}
                  <input
                    type="radio"
                    id="sore2"
                    name="muscle_sore"
                    value="2"
                    checked={selectedOptionMuscleSore === '2'}
                    onChange={(e) => setSelectedOptionMuscleSore(e.target.value)}
                  />
                  <label htmlFor="sore2">2</label>


                  {"  "}
                  <input
                    type="radio"
                    id="sore3"
                    name="muscle_sore"
                    value="3"
                    checked={selectedOptionMuscleSore === '3'}
                    onChange={(e) => setSelectedOptionMuscleSore(e.target.value)}
                  />
                  <label htmlFor="sore3">3</label>


                  {"  "}
                  <input
                    type="radio"
                    id="sore4"
                    name="muscle_sore"
                    value="4"
                    checked={selectedOptionMuscleSore === '4'}
                    onChange={(e) => setSelectedOptionMuscleSore(e.target.value)}
                  />
                  <label htmlFor="sore4">4</label>


                  {"  "}
                  <input
                    type="radio"
                    id="sore5"
                    name="muscle_sore"
                    value="5"
                    checked={selectedOptionMuscleSore === '5'}
                    onChange={(e) => setSelectedOptionMuscleSore(e.target.value)}
                  />
                  <label htmlFor="sore5">5</label>



                  {"  "}
                  <input
                    type="radio"
                    id="sore6"
                    name="muscle_sore"
                    value="6"
                    checked={selectedOptionMuscleSore === '6'}
                    onChange={(e) => setSelectedOptionMuscleSore(e.target.value)}
                  />
                  <label htmlFor="sore6">6</label>



                  {"  "}
                  <input
                    type="radio"
                    id="sore7"
                    name="muscle_sore"
                    value="7"
                    checked={selectedOptionMuscleSore === '7'}
                    onChange={(e) => setSelectedOptionMuscleSore(e.target.value)}
                  />
                  <label htmlFor="sore7">7</label>

                  <div className="pl-3 text-xs sm:text-lg">
                    Extrêmement élevé
                    </div>
                  </div>


                </form>

              </div>
            </div>



{/* INJURIED */}







            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Avez vous une blessure ? </p>

                  <div className="pt-3 flex justify-center items-center justify-items-center text-center">

                  <input
                    type="radio"
                    id="injuried1"
                    name="injuried"
                    value="1"
                    checked={selectedOptionInjuried === '1'}
                    onChange={(e) => setSelectedOptionInjuried(e.target.value)}
                  />
                  <label htmlFor="injuried1">Oui</label>


                  {"  "}
                  <input
                    type="radio"
                    id="injuried0"
                    name="injuried"
                    value="0"
                    checked={selectedOptionInjuried === '0'}
                    onChange={(e) => setSelectedOptionInjuried(e.target.value)}
                  />
                  <label htmlFor="injuried0">Non</label>

                  </div>

                </form>

              </div>
            </div>




            










            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Avez vous bu de l&apos;alcool hier ? </p>

                  <div className="pt-3 flex justify-center items-center justify-items-center text-center">

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








            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Avez vous effectuer un trajet de plus de 2h hier ? </p>

                  <div className="pt-3 flex justify-center items-center justify-items-center text-center">

                  <input
                    type="radio"
                    id="travel1"
                    name="travel"
                    value="1"
                    checked={selectedOptionTravel === '1'}
                    onChange={(e) => setSelectedOptionTravel(e.target.value)}
                  />
                  <label htmlFor="travel1">Oui</label>


                  {"  "}
                  <input
                    type="radio"
                    id="travel0"
                    name="travel"
                    value="0"
                    checked={selectedOptionTravel === '0'}
                    onChange={(e) => setSelectedOptionTravel(e.target.value)}
                  />
                  <label htmlFor="travel0">Non</label>

                  </div>

                </form>

              </div>
            </div>




            








            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Etes vous malade actuellement ?  </p>

                  <div className="pt-3 flex justify-center items-center justify-items-center text-center">

                  <input
                    type="radio"
                    id="sickness1"
                    name="sickness"
                    value="1"
                    checked={selectedOptionSickness === '1'}
                    onChange={(e) => setSelectedOptionSickness(e.target.value)}
                  />
                  <label htmlFor="sickness1">Oui</label>


                  {"  "}
                  <input
                    type="radio"
                    id="sickness0"
                    name="sickness"
                    value="0"
                    checked={selectedOptionSickness === '0'}
                    onChange={(e) => setSelectedOptionSickness(e.target.value)}
                  />
                  <label htmlFor="sickness0">Non</label>

                  </div>


                </form>

              </div>
            </div>

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