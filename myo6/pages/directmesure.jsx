import Header from '../components/Header'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Line as LineJS } from 'chart.js/auto'
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
    },
    scales: {
      y: {
        min:   0, // Valeur minimale
        suggestedMax: 40,
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

      var miny = 0
      var maxy = 0  

      for (var i =   0; i < area.length; i++) {
        area[i] = parseFloat(area[i]);
        if (area[i] < miny) {
          miny = area[i];
        }
        if (area[i] > maxy) {
          maxy = area[i];
        }
      }

      

      options.scales.y.min = miny -   5;
      options.scales.y.max = maxy +   5;

      

      setOptions(options);

      
      


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
  }, []);

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


//   useEffect(() => {
//     // Générer un timestamp unique
//     const timestamp = new Date().getTime();
//     // Ajouter le timestamp comme paramètre de requête à l'URL
//     window.location.href = `${window.location.pathname}?${timestamp}`;
//  }, []);


  return (
    <>  
      <Header></Header>

      <div className=" h-screen w-screen">
      
        <Navbar></Navbar>
      
        <hr className="w-full h-[4px] bg-beige"></hr>
      
        <div className='flex h-[calc(100%-68px)] '>
          {/* <SideBar></SideBar> */}
      
          <div id="main_code" className=" h-full  w-full bg-gray-300"> 
      
            <div className=" w-full p-2">
              <div className="flex bg-white rounded-lg shadow-xl border-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                  <div className="text-xl font-bold text-[#082431]">
                    Mesure en Direct
                  </div>
                </div>
      
            
                <div className=" text-lg p-4 font-bold text-[#082431]">
                    Vidéo n° 
                  {
                    video && video.id 
                  }
                  {' le '}
                  {
                        date && date
                   }

                </div>
      
      
                {/* <div className="w-full h-[10px] bg-transparent"></div> */}
      
                          
                <div className="flex">
                  <div className=" m-4  flex justify-center items-center justify-items-center w-1/3 ">
                    <div className="text-xl font-bold text-[#082431] bg-white rounded-none shadow-xl border-2 w-full  border-gray-400 flex justify-center items-center justify-items-center">
                      <video  autoPlay muted>
                        <source src="https://myo6.duckdns.org/api/video/last_video/video_traitement.mp4?t=${new Date().getTime()}" width="auto"/>
                        </video>   
                    </div>
                  </div>
                  <div className="m-4 flex justify-center items-center justify-items-center w-1/2">
                    <div className="text-xl font-bold text-[#082431] bg-white rounded-lg shadow-xl border-2 w-full h-full border-gray-400 flex justify-center items-center justify-items-center">
                      {
                        chartData && options &&
                        <Line data={chartData} options={options} />
                      }
                    </div>
                  </div>
                </div>




                <div className={showDiv ? 'fadeIn' : 'fadeOut'}>


                  <div className="flex ">
                    <div className="m-4  bg-white rounded-lg shadow-xl border-2  border-gray-400  justify-center items-center justify-items-center w-5/6 ">
                        <div className="text-2xl flex font-bold text-[#082431] justify-center items-center justify-items-center">
                          Résultats
                        </div>

                        <div className="flex justify-center items-center justify-items-center">


                          <div className="text-lg">
                          <div className="p-2 flex font-bold text-[#082431]  ">
                            Temps de réaction:
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.reaction_time }
                            {'  '} 
                            s
                          </div>
                          <div className="p-2 flex font-bold text-[#082431]  ">
                          Temps de constriction:
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.time_constriction }
                            {'  '} 
                            s
                          </div>
                        </div>


                        <div className="text-lg">
                          <div className="p-2 flex font-bold text-[#082431]  ">
                            Vitesse de constriction moyenne: 
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.average_constriction_velocity_area }
                            {'  '} 
                            mm/s
                          </div>
                          <div className="p-2 flex font-bold text-[#082431]  ">
                            Vitesse de constriction maximale: 
                            {'  '} 
                            { video && video.measure_metric && video.measure_metric.max_constriction_velocity_area }
                            {'  '} 
                            mm/s
                          </div>
                        </div>

                        <div className="text-lg">
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
                            { video && video.measure_metric && video.measure_metric.max_area }
                            {'  '} 
                            mm²
                          </div>
                        </div>

                        </div>
                      
                      </div>

                      
                     
                    <div className="mt-4 mr-4 mb-4 bg-white rounded-lg shadow-xl border-2  border-gray-400  justify-center items-center justify-items-center w-1/6 ">
                        <div className="text-2xl flex font-bold text-[#082431] justify-center items-center justify-items-center">
                          Etat de forme
                        </div>
                        
                        <div className="text-4xl p-2 flex font-bold text-[#082431] justify-center items-center justify-items-center">
                          {/* {(video && video.measure_metric && video.measure_metric.score).toFixed(2)} 
                          {(video && video.measure_metric && video.measure_metric.score)}
                          {Math.round((video && video.measure_metric && video.measure_metric.average_constriction_velocity_area)*((video && video.measure_metric && video.measure_metric.max_area) - (video && video.measure_metric && video.measure_metric.min_area))*(1/(video && video.measure_metric && video.measure_metric.average_constriction_velocity_area))*(video && video.measure_metric && video.measure_metric.max_area)) }
                          <br></br>
                          {Math.round((video && video.measure_metric && video.measure_metric.average_constriction_velocity_area))}  
                          <br></br>
                          {((video && video.measure_metric && video.measure_metric.max_area) - (video && video.measure_metric && video.measure_metric.min_area))}  
                          <br></br>
                          {Math.round(1/(video && video.measure_metric && video.measure_metric.reaction_time))} 
                          <br></br>
                          {((video && video.measure_metric && video.measure_metric.max_area))}    
                          <br></br>
                          {(((video && video.measure_metric && video.measure_metric.max_area) - (video && video.measure_metric && video.measure_metric.min_area))/(video && video.measure_metric && video.measure_metric.max_area)).toFixed(2)}%   */}
                          {(((video && video.measure_metric && video.measure_metric.max_area) - (video && video.measure_metric && video.measure_metric.max_area) + (video && video.measure_metric && video.measure_metric.score))).toFixed(2)}
                                                  
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