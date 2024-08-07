import Header from '../components/Header'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Line as LineJS } from 'chart.js/auto'
//import styles from '@/styles/Home.module.css'

export default function Home() {
  const [video, setVideo] = useState({});
  const [area, setArea] = useState([]);
  const [showDiv, setShowDiv] = useState(false);
  const [maxValue, setMaxValue] = useState(0);
  
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

  // let maxDataValue = Math.max(mostPositiveValue, options.suggestedMax);

  const [options , setOptions] = useState({


  
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Aire de la pupille',
      },
    },
    scales: {
      y: {
        min:   0, // Valeur minimale
        suggestedMax: 25,
      //  max:   30, // Valeur maximale
        
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
      const res = await fetch('http://localhost:3000/api/getLastVideo', {
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


      const max= Math.max(...area);
      console.log('max', max);
      const max2= max+10;
      console.log('max2', max2);

      setMaxValue(max2);
    }

    

    getMyVideos();
  }, []);

  useEffect(() => {
    if (area.length >   0) {
      // const max= Math.max(...area);
      // console.log('max', max);
      // const max2= max+10;
      // console.log('max2', max2);

      // setMaxValue(max2);
      setOptions(prevOptions => ({
        ...prevOptions,
        scales: {
          ...prevOptions.scales,
          y: {
            ...prevOptions.scales.y,
            max: maxValue,
          },
        },
      }));


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
                  <div className="m-4 flex justify-center items-center justify-items-center w-1/2">
                    <div className="text-xl font-bold text-[#082431] bg-white rounded-lg shadow-xl border-2 w-full h-full border-gray-400 flex justify-center items-center justify-items-center">
                      {
                        chartData && options &&
                        <Line data={chartData} options={options} />
                      }
                    </div>
                  </div>

</>
);
}