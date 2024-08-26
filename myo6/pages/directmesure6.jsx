import Header from '../components/Header'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import React, { useEffect, useState } from 'react';
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
  const [date , setDate] = useState("")
  const [area, setArea] = useState([]);
  const [showDiv, setShowDiv] = useState(false);
  const [plateau_end, setPlateau_end] = useState(0);
  const [plateau_start, setPlateau_start] = useState(0);
  const [start_constriction, setStart_constriction] = useState(0);
  
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'eye_area',
        data: [],
        borderColor: 'rgba(107,   114,   128,   1)',
        backgroundColor: 'rgba(0,   113,   143,   1)',
      },
    ],
  });

  const [options , setOptions] = useState({
  
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
        text: 'Aire de la pupille',
      }, 
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x',
            value: plateau_start,
            borderColor: 'red',
            borderWidth: 2,
            label: {
              enabled: true,
              content: 'Date importante',
              position: 'start',
            },
          },
        ],
      },
    },
    scales: {
      y: {
        min:   0, // Valeur minimale
        suggestedMax: 30,
      //  max:   50, // Valeur maximale
        
      },
      x: {
        min:   0, // Valeur minimale
        max:   270, // Valeur maximale
  
      },
      
    },
    animation: {
      duration:  0, // Durée de l'animation pour chaque point
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


      setPlateau_end(data.video.pupil_track.plateau_end);
      setPlateau_start(data.video.pupil_track.plateau_start);
      setStart_constriction(data.video.pupil_track.start_constriction);  


      setOptions({
        ...options,
        plugins: {
          ...options.plugins,
          annotation: {
            annotations: [
              {
                type: 'line',
                mode: 'vertical',
                scaleID: 'x',
                value: plateau_start,
                borderColor: 'red',
                borderWidth: 2,
                label: {
                  enabled: true,
                  content: 'Plateau start',
                  position: 'start',
                },
              },
              {
                type: 'line',
                mode: 'vertical',
                scaleID: 'x',
                value: plateau_end,
                borderColor: 'green',
                borderWidth: 2,
                label: {
                  enabled: true,
                  content: 'Plateau end',
                  position: 'start',
                },
              },
              {
                type: 'line',
                mode: 'vertical',
                scaleID: 'x',
                value: start_constriction,
                borderColor: 'blue',
                borderWidth: 2,
                label: {
                  enabled: true,
                  content: 'Start constriction',
                  position: 'start',
                },
              },
            ],
          },
        },
      });
      


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


    }

    

    getMyVideos();
  }, [plateau_end, plateau_start, start_constriction]);

  useEffect(() => {
    if (area.length >   0) {
      let labels = Array.from({ length: area.length }, (_, i) => i);
      let dataPoints = [];

      function animateData(index) {
        if (index < area.length-0) {
          dataPoints.push(area[index]);
          setChartData({
            //labels: labels.slice(0, index +   1),
            labels: Array.from({ length: 270 }, (_, index) => ((index+1) / 30).toFixed(1)),
            datasets: [
              {
                label: 'Aire de la pupille',
                data: dataPoints,
                borderColor: 'rgba(107,   114,   128,   1)',
                backgroundColor: 'rgba(0,   113,   143,   1)',
              },
            ],
          });

          setTimeout(() => animateData(index +   1),   30);
        }
      }

      animateData(0);
    }
  }, [area]);



  return (
    <>  
      <Header></Header>

      <div className=" h-screen w-screen">
      
        <Navbar></Navbar>
      
        <hr className="w-full h-[4px] bg-beige"></hr>
      
          <div className='flex  min-h-[calc(100%-68px)] bg-gray-300 h-auto '>
          <div id="main_code" className="h-full  w-full ">
      
            <div className=" w-full p-2">
              <div className="flex bg-white rounded-lg shadow-xl border-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                  <div className="text-xl font-bold text-[#082431]">
                    Mesure en Direct
                  </div>
                </div>
      
            
                <div className="text-lg p-4 font-bold text-[#082431]">
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
      
                          
                <div className="sm:flex">
                  <div className=" sm:m-4  flex justify-center items-center justify-items-center w-auto sm:w-1/3 ">
                    <div className="text-xl font-bold text-[#082431] bg-white rounded-none shadow-xl border-2 w-full  border-gray-400 flex justify-center items-center justify-items-center">
                      <video  autoPlay muted>
                        <source src="https://myo6.duckdns.org/api/video/last_video/video_traitement.mp4?t=${new Date().getTime()}" width="auto"/>
                        </video>   
                    </div>
                  </div>
                  <div className="mt-4 sm:m-4 flex justify-center items-center justify-items-center w-auto sm:w-1/2 h-1/2 sm:h-auto">
                    <div className="text-xl font-bold text-[#082431] bg-white rounded-lg shadow-xl border-2 w-full h-full border-gray-400 flex justify-center items-center justify-items-center">
                      {
                        chartData && options &&
                        <Line data={chartData} options={options} />
                      }
                    </div>
                  </div>
                </div>




                <div className={showDiv ? 'fadeIn' : 'fadeOut'}>
              

                  <div className="sm:flex ">
                    <div className="m-4 bg-white rounded-lg shadow-xl border-2 border-gray-400 w-auto sm:w-5/6 mx-auto">
                      <div className="text-lg sm:text-2xl font-bold text-[#082431] text-center p-2">
                          Résultats
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start text-center sm:text-left">



                        <div className="text-base sm:text-lg w-full sm:w-auto mb-4 sm:mb-0">
                          <div className="p-2 flex font-bold text-[#082431]">
                            Temps de réaction:
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.reaction_time }
                            {'  '} 
                            s
                          </div>
                          <div className="p-2 flex font-bold text-[#082431]">
                          Temps de constriction:
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.time_constriction }
                            {'  '} 
                            s
                          </div>
                        </div>


                        <div className="text-md sm:text-lg w-full sm:w-auto mb-4 sm:mb-0">
                          <div className="p-2 flex font-bold text-[#082431]  ">
                            Vitesse de constriction moyenne: 
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.average_constriction_velocity }
                            {'  '} 
                            mm/s
                          </div>
                          <div className="p-2 flex font-bold text-[#082431]  ">
                            Vitesse de constriction maximale: 
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.max_constriction_velocity }
                            {'  '} 
                            mm/s
                          </div>
                        </div>

                        <div className="text-md sm:text-lg w-full sm:w-auto">
                          <div className="p-2 flex font-bold text-[#082431]  ">
                            Aire de la pupille minimale:
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.min_area }
                            
                            {'  '} 
                            mm²
                          </div>
                          <div className="p-2 flex font-bold text-[#082431]  ">
                            Aire de la pupille maximale: 
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