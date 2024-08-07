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
  const [selectedValue, setSelectedValue] = useState(0);
  const [selectedOptionSleepQuality, setSelectedOptionSleepQuality] = useState(0);
  const [selectedOptionTrainLastDay, setSelectedOptionTrainLastDay] = useState(0);
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

    const selectedUser = users.find(user => user.id_user === selectedOption);
    if (selectedUser) {
       setSelectedUserGender(selectedUser.sex);
    }
  };

  useEffect(() => {
    getUser()
  }, []);



  const handleSubmit = async (event) => {
    event.preventDefault();

    let date = new Date();
    let date1 = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
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
     // "date_record":date1,
       "date_record": "2021-11-01",
      "sleep_quality": sleepQuality,
      // "asleep_time": "23:15",
      // "wakeup_time": "07:35",
      "asleep_time": selectedAsleepTime,
      "wakeup_time": selectedWakeupTime,
      "weight": selectedWeight,
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

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi des données');
      }

      const responseData = await response.json();
      console.log(responseData);
      // Gérer la réponse du serveur ici
    } catch (error) {
      console.error('Erreur:', error);
      // Gérer l'erreur ici
    }
    // return(
    //   <div>
    //     <h1>Questionnaire envoyé</h1>
    //   </div>
    // );
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
            <div className="w-full p-2 ">
              <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-fit">
                <div className="text-xl font-bold text-[#082431]">
                  Questionnaire
                </div>
              </div>
            </div>
            <div className="text-xl font-bold text-[#082431] pl-4">
              Utilisateur : 
            

            <select value={selectedValue} onChange={handleSelectChange} className="bg-white rounded-lg m-4 w-auto shadow-xl border-2 border-gray-400 text-lg">
              {users.map(user => (
                <option key={user.id_user} value={user.id_user}>
                  {user.firstname} {user.lastname}
                </option>
              ))}
            </select>
            </div>



            <div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className=" bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">


      <p>Quel est votre poids aujourd&apos;hui ?</p>
      <input
        type="text"
        value={selectedWeight}
        onChange={(e) => setSelectedWeight(e.target.value)}
        placeholder="Saisissez votre réponse"
      />
    </div>
    </div>



<div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className=" bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">


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

    <div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className=" bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">

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






{/* SLEEP QUALITY */}



            <div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Quelle est votre qualité de sommeil ?</p>

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


                </form>

              </div>
            </div>





{/* TRAINING LAST DAY */}




            <div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Comment était votre journée d&apos;entrainement d&apos;hier ?</p>

                  <input
                    type="radio"
                    id="trainld1"
                    name="train_lastday"
                    value="1"
                    checked={selectedOptionTrainLastDay === '1'}
                    onChange={(e) => setSelectedOptionTrainLastDay(e.target.value)}
                  />
                  <label htmlFor="trainld1">1</label>


                  {"  "}
                  <input
                    type="radio"
                    id="trainld2"
                    name="train_lastday"
                    value="2"
                    checked={selectedOptionTrainLastDay === '2'}
                    onChange={(e) => setSelectedOptionTrainLastDay(e.target.value)}
                  />
                  <label htmlFor="trainld2">2</label>


                  {"  "}
                  <input
                    type="radio"
                    id="trainld3"
                    name="train_lastday"
                    value="3"
                    checked={selectedOptionTrainLastDay === '3'}
                    onChange={(e) => setSelectedOptionTrainLastDay(e.target.value)}
                  />
                  <label htmlFor="trainld3">3</label>


                  {"  "}
                  <input
                    type="radio"
                    id="trainld4"
                    name="train_lastday"
                    value="4"
                    checked={selectedOptionTrainLastDay === '4'}
                    onChange={(e) => setSelectedOptionTrainLastDay(e.target.value)}
                  />
                  <label htmlFor="trainld4">4</label>


                  {"  "}
                  <input
                    type="radio"
                    id="trainld5"
                    name="train_lastday"
                    value="5"
                    checked={selectedOptionTrainLastDay === '5'}
                    onChange={(e) => setSelectedOptionTrainLastDay(e.target.value)}
                  />
                  <label htmlFor="trainld5">5</label>


                </form>

              </div>
            </div>





{/* TRAINING PERFORMANCE */}



            <div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Quel était votre performance à l&apos;entrainement hier par rapport à celle attendue/prévue ? </p>

                  <input
                    type="radio"
                    id="perf1"
                    name="train_perf"
                    value="1"
                    checked={selectedOptionTrainPerf === '1'}
                    onChange={(e) => setSelectedOptionTrainPerf(e.target.value)}
                  />
                  <label htmlFor="perf1">1</label>


                  {"  "}
                  <input
                    type="radio"
                    id="perf2"
                    name="train_perf"
                    value="2"
                    checked={selectedOptionTrainPerf === '2'}
                    onChange={(e) => setSelectedOptionTrainPerf(e.target.value)}
                  />
                  <label htmlFor="perf2">2</label>


                  {"  "}
                  <input
                    type="radio"
                    id="perf3"
                    name="train_perf"
                    value="3"
                    checked={selectedOptionTrainPerf === '3'}
                    onChange={(e) => setSelectedOptionTrainPerf(e.target.value)}
                  />
                  <label htmlFor="perf3">3</label>


                  {"  "}
                  <input
                    type="radio"
                    id="perf4"
                    name="train_perf"
                    value="4"
                    checked={selectedOptionTrainPerf === '4'}
                    onChange={(e) => setSelectedOptionTrainPerf(e.target.value)}
                  />
                  <label htmlFor="perf4">4</label>


                  {"  "}
                  <input
                    type="radio"
                    id="perf5"
                    name="train_perf"
                    value="5"
                    checked={selectedOptionTrainPerf === '5'}
                    onChange={(e) => setSelectedOptionTrainPerf(e.target.value)}
                  />
                  <label htmlFor="perf5">5</label>


                </form>

              </div>
            </div>



            



{/* PHYSICAL CONDITION */}





            <div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Comment est votre condition physique en ce moment ? </p>

                  <input
                    type="radio"
                    id="physicalc1"
                    name="phys_cond"
                    value="1"
                    checked={selectedOptionPhysCond === '1'}
                    onChange={(e) => setSelectedOptionPhysCond(e.target.value)}
                  />
                  <label htmlFor="physicalc1">1</label>


                  {"  "}
                  <input
                    type="radio"
                    id="physicalc2"
                    name="phys_cond"
                    value="2"
                    checked={selectedOptionPhysCond === '2'}
                    onChange={(e) => setSelectedOptionPhysCond(e.target.value)}
                  />
                  <label htmlFor="physicalc2">2</label>


                  {"  "}
                  <input
                    type="radio"
                    id="physicalc3"
                    name="phys_cond"
                    value="3"
                    checked={selectedOptionPhysCond === '3'}
                    onChange={(e) => setSelectedOptionPhysCond(e.target.value)}
                  />
                  <label htmlFor="physicalc3">3</label>


                  {"  "}
                  <input
                    type="radio"
                    id="physicalc4"
                    name="phys_cond"
                    value="4"
                    checked={selectedOptionPhysCond === '4'}
                    onChange={(e) => setSelectedOptionPhysCond(e.target.value)}
                  />
                  <label htmlFor="physicalc4">4</label>


                  {"  "}
                  <input
                    type="radio"
                    id="physicalc5"
                    name="phys_cond"
                    value="5"
                    checked={selectedOptionPhysCond === '5'}
                    onChange={(e) => setSelectedOptionPhysCond(e.target.value)}
                  />
                  <label htmlFor="physicalc5">5</label>


                </form>

              </div>
            </div>




            

{/* STRESS LEVEL */}






            <div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Quel est votre niveau de stress ce matin ? </p>

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

                </form>

              </div>
            </div>




            

{/* MUSCLE SORENESS */}






            <div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Comment évaluez vous votre niveau de douleurs musculaires/courbatures ce matin ? </p>

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


                </form>

              </div>
            </div>






{/* SUBJECTIVE FATIGUE */}







            <div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Quel est votre niveau de fatigue ressenti ? </p>

                  <input
                    type="radio"
                    id="fatigue1"
                    name="fatigue_subj"
                    value="1"
                    checked={selectedOptionFatigueSubj === '1'}
                    onChange={(e) => setSelectedOptionFatigueSubj(e.target.value)}
                  />
                  <label htmlFor="fatigue1">1</label>


                  {"  "}
                  <input
                    type="radio"
                    id="fatigue2"
                    name="fatigue_subj"
                    value="2"
                    checked={selectedOptionFatigueSubj === '2'}
                    onChange={(e) => setSelectedOptionFatigueSubj(e.target.value)}
                  />
                  <label htmlFor="fatigue2">2</label>


                  {"  "}
                  <input
                    type="radio"
                    id="fatigue3"
                    name="fatigue_subj"
                    value="3"
                    checked={selectedOptionFatigueSubj === '3'}
                    onChange={(e) => setSelectedOptionFatigueSubj(e.target.value)}
                  />
                  <label htmlFor="fatigue3">3</label>


                  {"  "}
                  <input
                    type="radio"
                    id="fatigue4"
                    name="fatigue_subj"
                    value="4"
                    checked={selectedOptionFatigueSubj === '4'}
                    onChange={(e) => setSelectedOptionFatigueSubj(e.target.value)}
                  />
                  <label htmlFor="fatigue4">4</label>


                  {"  "}
                  <input
                    type="radio"
                    id="fatigue5"
                    name="fatigue_subj"
                    value="5"
                    checked={selectedOptionFatigueSubj === '5'}
                    onChange={(e) => setSelectedOptionFatigueSubj(e.target.value)}
                  />
                  <label htmlFor="fatigue5">5</label>




                  {"  "}
                  <input
                    type="radio"
                    id="fatigue6"
                    name="fatigue_subj"
                    value="6"
                    checked={selectedOptionFatigueSubj === '6'}
                    onChange={(e) => setSelectedOptionFatigueSubj(e.target.value)}
                  />
                  <label htmlFor="fatigue6">6</label>



                  {"  "}
                  <input
                    type="radio"
                    id="fatigue7"
                    name="fatigue_subj"
                    value="7"
                    checked={selectedOptionFatigueSubj === '7'}
                    onChange={(e) => setSelectedOptionFatigueSubj(e.target.value)}
                  />
                  <label htmlFor="fatigue7">7</label>

                </form>

              </div>
            </div>




            

{/* INJURIED */}







            <div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Avez vous une blessure ? </p>

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

                </form>

              </div>
            </div>




            










            <div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Avez vous bu de l&apos;alcool hier ? </p>

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

                </form>

              </div>
            </div>




            





            {selectedUserGender === 'F' && (


            <div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Etes vous actuellement en période menstruelle ? </p>

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

                </form>

              </div>
            </div>




)

}

{selectedUserGender === 'M' && setSelectedOptionMenstruation === '0'}








            <div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Avez vous effectuer un trajet de plus de 2h hier ? </p>

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

                </form>

              </div>
            </div>




            








            <div className="w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">


                <form>
                  <p>Etes vous malade actuellement ?  </p>

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


                </form>

              </div>
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