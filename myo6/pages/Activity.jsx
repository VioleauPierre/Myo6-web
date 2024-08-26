import Header from '../components/Header'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Line as LineJS } from 'chart.js/auto'
import ReactPlayer from 'react-player';

export default function Home(props) {
  const [userId, setUserId] = useState();
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [activityDetails, setActivityDetails] = useState(null);
  const [showNewActivityForm, setShowNewActivityForm] = useState(false);
  const [rpe, setRpe] = useState(0);
  const sports = ['Run', 'Bike', 'Swim', 'VirtualRide', 'Strength'];

  const [newActivity, setNewActivity] = useState({
    user_id: '',
    type: '',
    start_date: '',
    distance: '',
    elapsed_time: '',
    average_speed: '',
    average_heartrate: '',
    max_heartrate: '',
    total_elevation_gain: '',
    average_watts: '',
    max_watts: '',
    average_cadence: ''
  });

  useEffect(() => {
    if (window.location.href.split("=")[1] !== undefined) {
      const id = window.location.href.split("=")[1];
      setUserId(id);
      setNewActivity(prev => ({ ...prev, user_id: id }));
    }
  }, []);


  useEffect(() => {
    getActivities();
  }, [userId]);

  async function getActivities() {
    if (userId) {
      const res = await fetch(`https://myo6.duckdns.org/api/${userId}/get_list_activity`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      
      const formattedData = {
        ...data,
        date: data.date.map(date => {
          let formattedDate = date.toString().substring(5, date.length - 7);
          formattedDate = formattedDate.replace(" Jan ", "/01/")
                                       .replace(" Feb ", "/02/")
                                       .replace(" Mar ", "/03/")
                                       .replace(" Apr ", "/04/")
                                       .replace(" May ", "/05/")
                                       .replace(" Jun ", "/06/")
                                       .replace(" Jul ", "/07/")
                                       .replace(" Aug ", "/08/")
                                       .replace(" Sep ", "/09/")
                                       .replace(" Oct ", "/10/")
                                       .replace(" Nov ", "/11/")
                                       .replace(" Dec ", "/12/");
          return formattedDate;
        })
      };
      
      setActivities(formattedData);
    }
  }

  const handleActivityChange = async (event) => {
    const index = event.target.value;
    setSelectedActivity(index);
    
    if (index !== "") {
      const activityId = activities.id_activity_list[index];
      const res = await fetch(`https://myo6.duckdns.org/api/${activityId}/get_activity_data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setActivityDetails(data.activity_dict);
    } else {
      setActivityDetails(null);
    }
  };

  const handleNewActivityChange = (e) => {
    setNewActivity({...newActivity, [e.target.name]: e.target.value});
  };

  const handleSubmitNewActivity = async (e) => {
    e.preventDefault();
    try {
      const activityWithRpe = { ...newActivity, rpe: rpe };
      const res = await fetch('https://myo6.duckdns.org/api/upload/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityWithRpe),
      });
      if (res.ok) {
        setShowNewActivityForm(false);
        setNewActivity({
          user_id: userId,
          type: '',
          start_date: '',
          distance: '',
          elapsed_time: '',
          average_speed: '',
          average_heartrate: '',
          max_heartrate: '',
          total_elevation_gain: '',
          average_watts: '',
          max_watts: '',
          average_cadence: ''
        });
        setRpe(0);
        getActivities();
      } else {
        console.error('Erreur lors de l\'envoi de l\'activité');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <>  
      <Header></Header>
      <div className="h-screen w-screen">
        <hr className="w-full h-[4px] bg-beige"></hr>
        <div className='flex min-h-[calc(100%-10px)] bg-gray-300 h-auto'>
          <div id="main_code" className="h-full w-full">
            <div className="w-full">   
              <div className='flex'>
                <div className="sm:flex justify-center items-center justify-items-center text-center sm:text-left">
                  <select 
                    value={selectedActivity} 
                    onChange={handleActivityChange}
                    className="bg-white rounded-lg m-2 sm:m-4 w-auto shadow-xl border-2 border-gray-400 text-md sm:text-lg"
                  >
                    <option value="">Sélectionnez une activité</option>
                    {activities.date && activities.date.map((date, index) => (
                      <option key={index} value={index}>
                        {date} - {activities.type_list[index]}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setShowNewActivityForm(!showNewActivityForm)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {showNewActivityForm ? 'Annuler' : '+'}
                  </button>
                </div>
              </div>
              <div className="sm:flex">
                <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
                  <div className="bg-white text-sm sm:text-lg text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                    <div className="text-2xl font-bold mb-4">
                      {showNewActivityForm ? 'Nouvelle Activité' : 'Activité'}
                    </div>
                    {showNewActivityForm ? (
                      <form onSubmit={handleSubmitNewActivity} className="m-2 text-left">
                        <div className="mb-2">
                          <label className="font-bold">Type : </label>
                          <select name="type" value={newActivity.type} onChange={handleNewActivityChange} className="border rounded px-2" >
                              <option value="">Sélectionnez un sport</option>
                              {sports.map((sport, index) => (
                                <option key={index} value={sport}>{sport}</option>
                              ))}
                            </select>
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Date : </label>
                          <input type="date" name="start_date" value={newActivity.start_date} onChange={handleNewActivityChange} className="border rounded px-2" />
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Distance : </label>
                          <input type="text" name="distance" value={newActivity.distance} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> m
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Durée : </label>
                          <input type="time" name="elapsed_time" value={newActivity.elapsed_time} onChange={handleNewActivityChange} className="border rounded px-2" /> 
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Vitesse moyenne : </label>
                          <input type="text" name="average_speed" value={newActivity.average_speed} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> m/s
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Fréquence cardiaque moyenne : </label>
                          <input type="text" name="average_heartrate" value={newActivity.average_heartrate} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> bpm
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Fréquence cardiaque maximale : </label>
                          <input type="text" name="max_heartrate" value={newActivity.max_heartrate} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> bpm
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Dénivelé positif : </label>
                          <input type="text" name="total_elevation_gain" value={newActivity.total_elevation_gain} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> m
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Puissance moyenne : </label>
                          <input type="text" name="average_watts" value={newActivity.average_watts} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> W
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Puissance maximale : </label>
                          <input type="text" name="max_watts" value={newActivity.max_watts} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> W
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Cadence moyenne : </label>
                          <input type="text" name="average_cadence" value={newActivity.average_cadence} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> rpm
                        </div>
                        <div className="mb-4">
                          <p className="font-bold mb-2">RPE (Rating of Perceived Exertion)</p>
                          
                          <div className="pt-3 flex flex-col items-center">
                            <div className="relative w-full">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={rpe}
                                onChange={(e) => setRpe(e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <div className="flex justify-between w-full px-1">
                                {[0, 20, 40, 60, 80, 100].map((value) => (
                                  <div key={value} className="flex flex-col items-center">
                                    <div className="h-3 w-0.5 bg-gray-300"></div>
                                    <span className="text-xs text-gray-500 mt-1">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between w-full mt-4 text-sm">
                              <span>Repos</span>
                              <span>Très facile</span>
                              <span>Facile</span>
                              <span>Modéré</span>
                              <span>Difficile</span>
                              <span>Maximal</span>
                            </div>
                            <div className="mt-2 text-center">
                              <span className="text-lg font-medium">Valeur: {rpe}</span>
                            </div>
                          </div>
                        </div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                          Ajouter l&apos;activité
                        </button>
                      </form>
                    ) : activityDetails && (
                      <div className="m-2 text-left">
                        <p><span className="font-bold">Type :</span> {activityDetails.type}</p>
                        <p><span className="font-bold">Date de début :</span> {activityDetails.start_date}</p>
                        <p><span className="font-bold">Distance :</span> {activityDetails.distance.toFixed(2)} m</p>
                        <p><span className="font-bold">Durée :</span> {(activityDetails.elapsed_time / 60).toFixed(2)} minutes</p>
                        <p><span className="font-bold">Vitesse moyenne :</span> {activityDetails.average_speed.toFixed(2)} m/s</p>
                        <p><span className="font-bold">Fréquence cardiaque moyenne :</span> {activityDetails.average_heartrate.toFixed(1)} bpm</p>
                        <p><span className="font-bold">Fréquence cardiaque maximale :</span> {activityDetails.max_heartrate} bpm</p>
                        <p><span className="font-bold">Dénivelé positif :</span> {activityDetails.total_elevation_gain} m</p>
                        {activityDetails.average_watts && <p><span className="font-bold">Puissance moyenne :</span> {activityDetails.average_watts.toFixed(1)} W</p>}
                        {activityDetails.max_watts && <p><span className="font-bold">Puissance maximale :</span> {activityDetails.max_watts} W</p>}
                        {activityDetails.average_cadence && <p><span className="font-bold">Cadence moyenne :</span> {activityDetails.average_cadence.toFixed(1)} rpm</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: { DEBUG_MODE: process.env.DEBUG_MODE },
  };
}