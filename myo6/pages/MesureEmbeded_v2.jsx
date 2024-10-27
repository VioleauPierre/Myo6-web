import Header from '../components/Header'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import React, { useEffect, useState,useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Line as LineJS } from 'chart.js/auto'
import ReactPlayer from 'react-player';
//import styles from '@/styles/Home.module.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);


export default function Home(props) {

  let baseUrl = "s";
  if (props.DEBUG_MODE === 'true') {
    baseUrl = "http://localhost:3000/";
    console.log("DEBUG_MODE");
  } else {
    baseUrl = "https://myo6-web.vercel.app/";
    console.log(baseUrl);
  }


  const [video, setVideo] = useState({});
  const [date , setDate] = useState("");

  const [videoid, setVideoId] = useState(2515);
  const [urlVideo , setUrlVideo] = useState("");
  const [urlVideoo , setUrlVideoo] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [timestamp] = useState(new Date().getTime());
  const [userId, setUserId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedValueMeasure, setSelectedValueMeasure] = useState(0);

  const [area, setArea] = useState([]);
  const [showDiv, setShowDiv] = useState(false);

  const [position, setPosition] = useState('None');
  const [exercice, setExercice] = useState('None');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [plateau_end, setPlateau_end] = useState(0);
  const [plateau_start, setPlateau_start] = useState(0);
  const [start_constriction, setStart_constriction] = useState(0);
  const verticalLineValues = [plateau_end, plateau_start, start_constriction];
  const [FRAME_RATE, setFRAME_RATE] = useState(30); // Default value
  const [FRAME_DELAY, setFRAME_DELAY] = useState(1000/30);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Pupil area',
      data: [],
      borderColor: "#FF5000",
      backgroundColor: "#FF5000",
      pointRadius: 2,
      borderWidth: 1.5,
      tension: 0.2,
    }],
  });



  // Options de configuration du graphique
  const [options, setOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.yLabel;
          }
        }
      },
      title: {
        display: true,
        text: 'Pupil area',
        color: "#FF5000",
        font: {
          size: 20,}
      },
    },
    scales: {
      y: {
        min:   0, // Valeur minimale
        // max:   Math.max(...data.map(item => item.area),), // Valeur maximale
        suggestedMax: 20,
        color: '#FF5000',
        ticks: {
          color: '#FF5000', // Set Y-axis ticks color to white
        },
        // max:   50, // Valeur maximale
      },
      x: {
        min:   0, // Valeur minimale
        max:   0, // Valeur maximale
        color: '#FF5000',
        ticks: {
          color: '#FF5000',
          stepSize: 1, // Step size of 1 ensures only integers appear on the x-axis
          callback: (value) => Number.isInteger(value/FRAME_RATE) ? value/FRAME_RATE : null, // Show only integer labels
        },
      },
      
    },
    animation: {
      duration: 0.02,
    },
  });



  const handleSelectChangeMeasure = (event) => {
    const selectedOption = event.target.value;
    setSelectedValueMeasure(selectedOption);
    setVideoId(selectedOption);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage('');
    setSubmissionMessage('');

    const url_upload_form = `https://myo6.duckdns.org/api/${videoid}/add_tag`;
    const data_form = {
      'position' : position,
      'exercice' : exercice
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
        setSubmissionMessage('Tags envoyés');
      } else {
        setErrorMessage('Une erreur s\'est produite');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Une erreur s\'est produite');
    }
  };







  useEffect(() => {
    // Mettre en place un délai de 10 secondes avant d'afficher la div
    const timer = setTimeout(() => {
      setShowDiv(true);
    }, 10000);

    // Nettoyer le timer pour éviter les fuites de mémoire
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.location.href.split("=")[1] !== undefined) {
      const idUser = window.location.href.split("=")[1];
      if (idUser) {
        setUserId(idUser);
        getVideo(idUser);
      }
    }
  }, []);

  useEffect(() => {


    async function getMyVideos() {
      console.log(videoid);
      const res = await fetch(baseUrl + 'api/getSpecificVideo?id_video=' + videoid, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log(data);
      var jsonString = JSON.stringify(data.video_data.pupil_track.area);
      var trimmedString = jsonString.slice(0, -1);
      var area = trimmedString.split(",");
     // setUrlVideoo('http://141.145.200.146:5000/api/video/'+ window.location.href.split("=")[1] + '/video_traitement.mp4');
      //setUrlVideo('http://141.145.200.146:5000/api/video/' + videoid + '/video_traitement.mp4');

      for (var i =   0; i < area.length; i++) {
        area[i] = parseFloat(area[i]);
      }

      setArea(area);
      setVideo(data.video_data);
      var MyDate = data.video_data.date_record
      MyDate = MyDate.toString().substring(5, MyDate.length - 7);
      MyDate = MyDate.toString().replace(" Jan ", "/01/");
      MyDate = MyDate.toString().replace(" Feb ", "/02/");
      MyDate = MyDate.toString().replace(" Mar ", "/03/");
      MyDate = MyDate.toString().replace(" Apr ", "/04/");
      MyDate = MyDate.toString().replace(" May ", "/05/");
      MyDate = MyDate.toString().replace(" Jun ", "/06/");
      MyDate = MyDate.toString().replace(" Jul ", "/07/");
      MyDate = MyDate.toString().replace(" Aug ", "/08/");
      MyDate = MyDate.toString().replace(" Sep ", "/09/");
      MyDate = MyDate.toString().replace(" Oct ", "/10/");
      MyDate = MyDate.toString().replace(" Nov ", "/11/");
      MyDate = MyDate.toString().replace(" Dec ", "/12/");
      setDate(MyDate);

      setPosition(data.video_data.position);
      setExercice(data.video_data.exercice);
      setFRAME_RATE(data.video_data.pupil_track.fps);
      setFRAME_DELAY(1000/FRAME_RATE);
      setPlateau_end(data.video_data.pupil_track.plateau_end);
      setPlateau_start(data.video_data.pupil_track.plateau_start);
      setStart_constriction(data.video_data.pupil_track.start_constriction);  

    }

    

    getMyVideos();
  }, [FRAME_RATE, FRAME_DELAY,plateau_end, plateau_start, start_constriction, videoid, selectedValueMeasure]);




  useEffect(() => {
    if (area.length > 0 && isVideoReady) {
      let dataPoints = [];
      const samplingRate = 2;
      const sampledArea = area.filter((_, index) => index % samplingRate === 0);
      
      setOptions(prevOptions => ({
        ...prevOptions,
        scales: {
          ...prevOptions.scales,
          x: {
            ...prevOptions.scales.x,
            max: (area.length/2) - 1,
            ticks: {
              color: '#FF5000',
              stepSize: samplingRate,
              callback: (value) => Number.isInteger(value/(FRAME_RATE/2)) ? value/(FRAME_RATE/2) : null,
            },
          },
        },
      }));

      const startSync = () => {
        if (videoRef.current) {
          videoRef.current.play();
          animateData(0);
        }
      };

      let lastFrameTime = performance.now();
      
      function animateData(index) {
        const currentTime = performance.now();
        const elapsed = currentTime - lastFrameTime;
        
        if (elapsed >= FRAME_DELAY) {
          if (index < sampledArea.length) {
            dataPoints.push(sampledArea[index]);
            
            setChartData({
              labels: Array.from({ length: area.length }, (_, i) => i/FRAME_RATE),
              datasets: [{
                label: 'Pupil area',
                data: dataPoints,
                borderColor: "#FF5000",
                backgroundColor: "#FF5000",
                pointRadius: 2,
                borderWidth: 1.5,
                tension: 0.2,
              }],
            });
            
            lastFrameTime = currentTime;
            requestAnimationFrame(() => animateData(index + 1));
          }
        } else {
          requestAnimationFrame(() => animateData(index));
        }
      }

      const timer = setTimeout(startSync, 100);
      return () => clearTimeout(timer);
    }
  }, [area, FRAME_RATE, FRAME_DELAY, isVideoReady]);



  async function getVideo(userId) {
    try {
      const url = baseUrl + 'api/getAllUserVideoList?id_user=' + userId;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if(data.user_id_video_list.length > 0) {
          const videoList = data.user_date_record_list.map((date, index) => ({
            id_video: data.user_id_video_list[index],
            date_record: date
          }));
          setVideos(videoList);
          setSelectedValueMeasure(videoList[videoList.length - 1].id_video);
          setVideoId(videoList[videoList.length - 1].id_video);  
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  }


  return (
    <>  
      <Header></Header>

      <div className=" h-screen w-screen">
      
    
      
        <div className='flex  min-h-[calc(100%-10px)] bg-gray-900 h-auto '>
      
      
        <div id="main_code" className="h-full  w-full ">
      
            <div className="w-full">

            {videos.length > 0 && (
              <select value={selectedValueMeasure} onChange={handleSelectChangeMeasure} className="bg-gray-700 text-white rounded-lg m-2 sm:m-4 w-auto shadow-xl border-gray-600 text-md sm:text-lg">
                {videos.sort((a, b) => new Date(b.date_record) - new Date(a.date_record)).map(video => (
                  <option key={video.id_video} value={video.id_video}>
                    {/* {new Date(video.date_record).toLocaleString()} */}
                    {video.date_record.slice(4, -7)}
                  </option>
                ))}
              </select>
            )}
               
                <div className="text-md sm:text-xl p-4 font text-white">
                  
                    Vidéo n° 
                  {
                    video && video.id_video 
                  }
                  {' le '}
                  {
                        date && date
                   }

                </div>
      
            
                <div className="sm:flex justify-center items-center mt-4">
                    {/* Video Section */}
                    <div className="sm:m-4 flex justify-center items-center w-full sm:w-1/2">
                      <div className="text-xl font-bold text-[#082431] bg-gray-900 rounded shadow-xl w-full flex justify-center items-center">
                        <video 
                          ref={videoRef}
                          width="100%" 
                          className="sm:w-full w-3/4" 
                          muted
                          onLoadedData={() => setIsVideoReady(true)}
                          preload="auto"
                        >
                          <source src={`https://myo6.duckdns.org/api/video/2515/video_traitement.mp4?t=${timestamp}`} />
                        </video>
                      </div>
                    </div>

                    {/* Plot Section */}
                    <div className="sm:m-4 flex justify-center items-center w-full sm:w-1/2 h-full">
                    <div className="text-xl font-bold text-white bg-gray-800 rounded-lg shadow-xl border-2 w-full h-[400px] sm:h-[500px] border-gray-700 flex justify-center items-center">
                        {chartData && options && <Line data={chartData} options={options} />}
                      </div>
                    </div>
                  </div>        
                





                <div className={showDiv ? 'fadeIn' : 'fadeOut'}>


                <div className="sm:flex ">
                    <div className="m-4 bg-gray-800 rounded-lg shadow-xl border-2 border-gray-700 w-auto sm:w-5/6 mx-auto">
                      <div className="text-lg sm:text-2xl font text-white text-center p-2">
                          Résultats
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start text-center sm:text-left">



                        <div className="text-base sm:text-lg w-full sm:w-auto mb-4 sm:mb-0">
                          <div className="p-2 flex font text-white">
                            Reaction time:
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.reaction_time }
                            {'  '} 
                            s
                          </div>
                          <div className="p-2 flex font text-white">
                          Constriction time:
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.time_constriction }
                            {'  '} 
                            s
                          </div>
                        </div>


                        <div className="text-md sm:text-lg w-full sm:w-auto mb-4 sm:mb-0">
                          <div className="p-2 flex font text-white  ">
                            Average constriction velocity: 
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.average_constriction_velocity }
                            {'  '} 
                            mm/s
                          </div>
                          <div className="p-2 flex font text-white  ">
                            Max constriction velocity: 
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.max_constriction_velocity }
                            {'  '} 
                            mm/s
                          </div>
                        </div>

                        <div className="text-md sm:text-lg w-full sm:w-auto">
                          <div className="p-2 flex font text-white  ">
                            Min area:
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.min_area }
                            
                            {'  '} 
                            mm²
                          </div>
                          <div className="p-2 flex font text-white  ">
                            Max area: 
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.max_area_dilation }
                            {'  '} 
                            mm²
                          </div>
                        </div>

                        </div>
                      
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
  // fetch env.local variables named DEBUG_MODE
console.log(process.env.DEBUG_MODE);
  return {
    props: { DEBUG_MODE: process.env.DEBUG_MODE },
  };
}