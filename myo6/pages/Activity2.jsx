import Header from '../components/Header'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Line as LineJS } from 'chart.js/auto'
import ReactPlayer from 'react-player';

export default function Home(props) {
  let baseUrl = "s";
  if (props.DEBUG_MODE === 'true') {
    baseUrl = "http://localhost:3000/";
  } else {
    baseUrl = "https://myo6.vercel.app/";
  }

  const [userId, setUserId] = useState();
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [activityDetails, setActivityDetails] = useState(null);
  const [showNewActivityForm, setShowNewActivityForm] = useState(false);
  const [sortedActivities, setSortedActivities] = useState([]);
  const sports = ['Run', 'Bike', 'Swim', 'VirtualRide', 'Strength'];

  const [selectedType, setSelectedType] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedDistance, setSelectedDistance] = useState(null);
  const [selectedElapsedTime, setSelectedElapsedTime] = useState(null);
  const [selectedAverageSpeed, setSelectedAverageSpeed] = useState(null);
  const [selectedAverageHeartrate, setSelectedAverageHeartrate] = useState(null);
  const [selectedMaxHeartrate, setSelectedMaxHeartrate] = useState(null);
  const [selectedTotalElevationGain, setSelectedTotalElevationGain] = useState(null);
  const [selectedAverageWatts, setSelectedAverageWatts] = useState(null);
  const [selectedMaxWatts, setSelectedMaxWatts] = useState(null);
  const [selectedAverageCadence, setSelectedAverageCadence] = useState(null);
  const [selectedRpe, setSelectedRpe] = useState(0);

  const [submissionMessage, setSubmissionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedActivityRpe, setSelectedActivityRpe] = useState(0);

  useEffect(() => {
    if (activities.date) {
      const activitiesArray = activities.date.map((date, index) => ({
        date: date,
        type: activities.type_list[index],
        id: activities.id_activity_list[index]
      }));

      const sorted = activitiesArray.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      setSortedActivities(sorted);
    }
  }, [activities]);

  useEffect(() => {
    if (window.location.href.split("=")[1] !== undefined) {
      const id = window.location.href.split("=")[1];
      setUserId(id);
    }
  }, []);

  useEffect(() => {
    getActivities();
  }, [userId]);

  async function getActivities() {
    if (userId) {
      try {
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
      setSelectedActivity(''); // Réinitialiser l'activité sélectionnée
      setActivityDetails(null); // Réinitialiser les détails de l'activité
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
      setErrorMessage("Une erreur s'est produite lors de la récupération des activités");
    }
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
      setSelectedActivityRpe(data.activity_dict.rpe || 0);
    } else {
      setActivityDetails(null);
      setSelectedActivityRpe(0);
    }
  };

  const handleNewActivityChange = (e) => {
    const { name, value } = e.target;
    switch(name) {
      case 'type':
        setSelectedType(value);
        break;
      case 'start_date':
        setSelectedStartDate(value ? `${value}:00` : '');
        break;
      case 'distance':
        setSelectedDistance(value);
        break;
      case 'elapsed_time':
        setSelectedElapsedTime(value);
        break;
      case 'average_speed':
        setSelectedAverageSpeed(value);
        break;
      case 'average_heartrate':
        setSelectedAverageHeartrate(value);
        break;
      case 'max_heartrate':
        setSelectedMaxHeartrate(value);
        break;
      case 'total_elevation_gain':
        setSelectedTotalElevationGain(value);
        break;
      case 'average_watts':
        setSelectedAverageWatts(value);
        break;
      case 'max_watts':
        setSelectedMaxWatts(value);
        break;
      case 'average_cadence':
        setSelectedAverageCadence(value);
        break;
    }
  };

  const handleRpeSubmit = async () => {
    if (!selectedActivity || selectedActivityRpe === 0) return;
    setErrorMessage('');
    setSubmissionMessage('');
    
    const activityId = activities.id_activity_list[selectedActivity];
    const url = `https://myo6.duckdns.org/api/${activityId}/add_rpe`;
    console.log(activityId, selectedActivityRpe);

  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rpe: selectedActivityRpe }),
      });
  
      if (response.ok) {
        setSubmissionMessage("RPE ajouté avec succès.");
        // Vous pouvez choisir de rafraîchir les détails de l'activité ici si nécessaire
      } else {
        setErrorMessage("Erreur lors de l'ajout du RPE.");
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage("Une erreur s'est produite lors de l'envoi du RPE");
    }
  };

  const handleSubmitNewActivity = async (e) => {
    e.preventDefault();

    setErrorMessage('');
    setSubmissionMessage('');
    
    if (!selectedType || !selectedStartDate || !selectedElapsedTime) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setErrorMessage('');

    const convertValue = (value, converter) => {
      if (value === '' || value === undefined || value === null) return null;
      const result = converter(value);
      return isNaN(result) ? null : result;
    };

    const formattedDate = selectedStartDate.replace('T', ' ');

    const url_upload_activity = `https://myo6.duckdns.org/upload/activity`;
    const data_activity = {
      "id_user": userId,
      "type": selectedType,
      "start_date": formattedDate,
      "distance": convertValue(selectedDistance, parseFloat),
      "elapsed_time": selectedElapsedTime,
      "average_speed": convertValue(selectedAverageSpeed, parseFloat),
      "average_heartrate": convertValue(selectedAverageHeartrate, parseFloat),
      "max_heartrate": convertValue(selectedMaxHeartrate, parseInt),
      "total_elevation_gain": convertValue(selectedTotalElevationGain, parseFloat),
      "average_watts": convertValue(selectedAverageWatts, parseFloat),
      "max_watts": convertValue(selectedMaxWatts, parseInt),
      "average_cadence": convertValue(selectedAverageCadence, parseFloat),
      "rpe": selectedRpe === 0 ? null : selectedRpe
    };
    console.log('data_activity:', data_activity);

    try {
      const response = await fetch(url_upload_activity, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data_activity),
      });

      if (response.ok) {
        setSubmissionMessage("L'activité a été enregistrée avec succès.");
        //setShowNewActivityForm(false);
        // Réinitialiser tous les champs
        setSelectedType(null);
        setSelectedStartDate(null);
        setSelectedDistance(null);
        setSelectedElapsedTime(null);
        setSelectedAverageSpeed(null);
        setSelectedAverageHeartrate(null);
        setSelectedMaxHeartrate(null);
        setSelectedTotalElevationGain(null);
        setSelectedAverageWatts(null);
        setSelectedMaxWatts(null);
        setSelectedAverageCadence(null);
        setSelectedRpe(0);
        setSelectedActivity('');
        setActivityDetails(null);
        await getActivities();
        setTimeout(() => {
          setSubmissionMessage('');
        }, 3000);
      } else {
        setErrorMessage("Une erreur s'est produite lors de l'enregistrement de l'activité");
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage("Une erreur s'est produite lors de l'envoi de l'activité");
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
                  {sortedActivities.map((activity, index) => (
                    <option key={index} value={index}>
                      {activity.date} - {activity.type}
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
                        <p className="text-sm text-red-500 mb-2">* Champs obligatoires</p>
                        <div className="mb-2">
                          <label className="font-bold">Type : <span className="text-red-500">*</span></label>
                          <select name="type" value={selectedType} onChange={handleNewActivityChange} className="border rounded px-2" required>
                            <option value="">Sélectionnez un sport</option>
                            {sports.map((sport, index) => (
                              <option key={index} value={sport}>{sport}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-2">
                            <label className="font-bold">Date et heure : <span className="text-red-500">*</span></label>
                            <input 
                              type="datetime-local" 
                              name="start_date" 
                              value={selectedStartDate} 
                              onChange={handleNewActivityChange} 
                              className="border rounded px-2" 
                              required 
                            />
                          </div>
                        


                        <div className="mb-2">
                          <label className="font-bold">Durée : <span className="text-red-500">*</span></label>
                          <input 
                            type="time" 
                            name="elapsed_time" 
                            value={selectedElapsedTime} 
                            onChange={handleNewActivityChange} 
                            step="1"
                            className="border rounded px-2" 
                            required 
                          />
                        </div>

                        <div className="mb-2">
                          <label className="font-bold">Distance :</label>
                          <input type="text" name="distance" value={selectedDistance} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> m
                        </div>


                        <div className="mb-2">
                          <label className="font-bold">Vitesse moyenne : </label>
                          <input type="text" name="average_speed" value={selectedAverageSpeed} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> m/s
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Fréquence cardiaque moyenne : </label>
                          <input type="text" name="average_heartrate" value={selectedAverageHeartrate} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> bpm
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Fréquence cardiaque maximale : </label>
                          <input type="text" name="max_heartrate" value={selectedMaxHeartrate} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> bpm
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Dénivelé positif : </label>
                          <input type="text" name="total_elevation_gain" value={selectedTotalElevationGain} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> m
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Puissance moyenne : </label>
                          <input type="text" name="average_watts" value={selectedAverageWatts} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> W
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Puissance maximale : </label>
                          <input type="text" name="max_watts" value={selectedMaxWatts} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> W
                        </div>
                        <div className="mb-2">
                          <label className="font-bold">Cadence moyenne : </label>
                          <input type="text" name="average_cadence" value={selectedAverageCadence} onChange={handleNewActivityChange} className="border rounded w-20 px-2" /> rpm
                        </div>
                        <div className="mb-4">
                          <p className="font-bold mb-2">RPE (Rating of Perceived Exertion)</p>
                          
                          <div className="pt-3 flex flex-col items-center">
                            <div className="relative w-full">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={selectedRpe}
                                onChange={(e) => setSelectedRpe(e.target.value)}
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
                              <span className="text-lg font-medium">Valeur: {selectedRpe}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex w-full p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
                          {errorMessage && <div className="bg-red-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{errorMessage}</div>}
                          {submissionMessage && <div className="bg-green-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{submissionMessage}</div>}
                        </div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                        Ajouter l&apos;activité
                        </button>
                      </form>
                    ) :selectedActivity ? (
                      activityDetails && (
                        <div className="m-2 text-left">
                          <p><span className="font-bold">Type :</span> {activityDetails.type || 'N/A'}</p>
                          <p><span className="font-bold">Date de début :</span> {activityDetails.start_date || 'N/A'}</p>
                          <p><span className="font-bold">Distance :</span> {activityDetails.distance != null ? `${activityDetails.distance.toFixed(2)} m` : 'N/A'}</p>
                          <p><span className="font-bold">Durée :</span> {activityDetails.elapsed_time != null ? `${(activityDetails.elapsed_time / 60).toFixed(2)} minutes` : 'N/A'}</p>
                          <p><span className="font-bold">Vitesse moyenne :</span> {activityDetails.average_speed != null ? `${activityDetails.average_speed.toFixed(2)} m/s` : 'N/A'}</p>
                          <p><span className="font-bold">Fréquence cardiaque moyenne :</span> {activityDetails.average_heartrate != null ? `${activityDetails.average_heartrate.toFixed(1)} bpm` : 'N/A'}</p>
                          <p><span className="font-bold">Fréquence cardiaque maximale :</span> {activityDetails.max_heartrate != null ? `${activityDetails.max_heartrate} bpm` : 'N/A'}</p>
                          <p><span className="font-bold">Dénivelé positif :</span> {activityDetails.total_elevation_gain != null ? `${activityDetails.total_elevation_gain} m` : 'N/A'}</p>
                          {activityDetails.average_watts != null && <p><span className="font-bold">Puissance moyenne :</span> {activityDetails.average_watts.toFixed(1)} W</p>}
                          {activityDetails.max_watts != null && <p><span className="font-bold">Puissance maximale :</span> {activityDetails.max_watts} W</p>}
                          {activityDetails.average_cadence != null && <p><span className="font-bold">Cadence moyenne :</span> {activityDetails.average_cadence.toFixed(1)} rpm</p>}

                          <div className="mt-4">
                          <p className="font-bold mb-2">Ajouter/Modifier RPE</p>
                          <div className="pt-3 flex flex-col items-center">
                            <div className="relative w-full">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={selectedActivityRpe}
                                onChange={(e) => setSelectedActivityRpe(e.target.value)}
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
                              <span className="text-lg font-medium">Valeur: {selectedActivityRpe}</span>
                            </div>
                          </div>
                          <div className="flex w-full p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
                          {errorMessage && <div className="bg-red-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{errorMessage}</div>}
                          {submissionMessage && <div className="bg-green-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{submissionMessage}</div>}
                        </div>
                          <button 
                            onClick={handleRpeSubmit}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                          >
                            Envoyer RPE
                          </button>
                        </div>
                      </div>
                      )
                    ) : (
                      <p>Sélectionnez une activité pour voir les détails ou ajoutez-en une nouvelle.</p>
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