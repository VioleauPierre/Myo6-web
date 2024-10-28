import withAuth from '../components/withAuth';
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Line as LineJS } from 'chart.js/auto'
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

//import styles from '@/styles/Home.module.css'

function Home(props) {


  let baseUrl = "s";
  if (props.DEBUG_MODE === 'true') {
    baseUrl = "http://localhost:3000/";
    console.log("DEBUG_MODE");
  } else {
    baseUrl = "https://myo6-web.vercel.app/";
    console.log(baseUrl);
  }




  const [video, setVideo] = useState({});
  const [date , setDate] = useState("")
  const [area, setArea] = useState([]);
  const [showDiv, setShowDiv] = useState(false);
  const [timestamp] = useState(new Date().getTime());
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'eye_area',
        data: [],
        borderColor: 'rgba(0,   0,   140,   1)',
        backgroundColor: 'rgba(0,   113,   143,   1)',
      },
    ],
  });
  // Set this to the frame rate of your video
  const [FRAME_RATE, setFRAME_RATE] = useState(0);
  const [FRAME_DELAY, setFRAME_DELAY] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);
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


  useEffect(() => {
    // Mettre en place un délai de 2 secondes avant d'afficher la div
    const timer = setTimeout(() => {
      setShowDiv(true);
    }, 9500);

    // Nettoyer le timer pour éviter les fuites de mémoire
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('options', options);
  }
  , [options]);

  useEffect(() => {
    async function getMyVideos() {
      const res = await fetch(baseUrl + 'api/getLastVideo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      var jsonString = JSON.stringify(data.video.pupil_track.area);
      var trimmedString = jsonString.slice(0, -1);
      var area = trimmedString.split(",");

      setArea(area);
      setVideo(data.video);
      var MyDate = data.video.date_record
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
      setFRAME_RATE(data.video.pupil_track.fps);
      setFRAME_DELAY(1000/FRAME_RATE);
    }
  

    getMyVideos();
  }, [FRAME_RATE, FRAME_DELAY]);

  useEffect(() => {
    if (area.length > 0 && isVideoReady) {
      let dataPoints = [];
      const samplingRate = 2;
      const sampledArea = area.filter((_, index) => index % samplingRate === 0);
      
      setOptions((prevOptions) => ({
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

      // Start both video and animation together
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
              datasets: [
                {
                  label: 'Pupil area',
                  data: dataPoints,
                  borderColor: "#FF5000",
                  backgroundColor: "#FF5000",
                  pointRadius: 2,
                  borderWidth: 1.5,
                  tension: 0.2,
                },
              ],
            });
            
            lastFrameTime = currentTime;
            requestAnimationFrame(() => animateData(index + 1));
          }
        } else {
          requestAnimationFrame(() => animateData(index));
        }
      }

      // Start synchronization after a short delay to ensure video is loaded
      const timer = setTimeout(startSync, 100);
      return () => clearTimeout(timer);
    }
  }, [area, FRAME_RATE, FRAME_DELAY, isVideoReady]);


  return (
    <>  
      <Header></Header>

      <div className=" h-screen w-screen">
      
        <Navbar></Navbar>
      
          <div className='flex  min-h-[calc(100%-68px)] bg-gray-900 h-auto '>
          <div id="main_code" className="h-full  w-full ">
      
            <div className=" w-full p-2">
              <div className="text-xl font-bold text-[#082431] bg-gray-900 rounded-none shadow-xl w-full flex justify-center items-center justify-items-center">
                  <div className="text-xl font-bold text-gray-100">
                    Last measure
                  </div>
                </div>
      
            
                <div className="text-xl p-4 font text-gray-100">
                    Vidéo n° 
                  {
                    video && video.id_video 
                  }
                  {' le '}
                  {
                        date && date
                   }

                </div>
      
      
                {/* <div className="w-full h-[10px] bg-transparent"></div> */}
      
                          
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
                          <source src={`https://myo6.duckdns.org/api/video/last_video/video_traitement.mp4?t=${timestamp}`} />
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
                          Results
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

Home.displayName = 'Home';

export default withAuth(Home);