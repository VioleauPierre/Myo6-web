import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home(props) {

  let baseUrl = "s";
  if (props.DEBUG_MODE === 'true') {
    baseUrl = "http://localhost:3000/";
    console.log("DEBUG_MODE");
  } else {
    baseUrl = "https://myo6.vercel.app/";
    console.log(baseUrl);
  }


const [options, setOptions] = useState({

  responsive: true,
  aspectRatio: 2,
  plugins: {
    title: {
      display: true,
      text: 'Training Load',
      font: {
        size: 20,
      },
    },
    legend: {
      position: 'top',
    },
  },
  scales: {

    x: {
      
      title: {
        display: true,
        // text: 'Date',
      },
    },
    
      y: {
        type: 'linear',
        display: true,
        position: 'left',

      },
      y1: {
        ticks: {
             beginAtZero: true,
             callback: function(value, index, values) {
               return (index === 2) ? "" : null;
             },
            },
        type: 'linear',
        display: true,
        position: 'right',
        


        // grid line settings
        grid: {
          drawOnChartArea: true, // only want the grid lines for one axis to show up
        },
      
    // y: {
      // ticks: {
      //   beginAtZero: true,
      //   callback: function(value, index, values) {
      //     return (index === 2) ? "0" : null;
      //   }
      // },
    //   grid: {
    //     color: 'blue',
    //   },
    //   title: {
    //     display: true,
    //     text: 'Load',
    //   },
    // },
    // y2: {
    //        ticks: {
    //      beginAtZero: true,
    //      callback: function(value, index, values) {
    //        return (index === 2) ? "0" : null;
    //      }
    //    },
      // max: 100,
      // min: 0,
      // ticks: {
      //   display: false,
      //   stepSize: 1,
      // },
      // grid: {
      //   drawTicks: false,
      //   drawBorder: false,
      //   color: 'rgba(255, 0, 255, 1)'
      // }
    },
  },

});


useEffect(() => {
  if (typeof window !== 'undefined') {
    const handleResize = () => {
      setOptions((prevOptions) => ({
        ...prevOptions,
        aspectRatio: window.innerWidth < 768 ? 1.25 : 2,
      }));
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Appeler la fonction une fois pour définir l'aspect ratio initial

    return () => window.removeEventListener('resize', handleResize);
  }
}, []);


 const [data, setData] = useState([]);

 useEffect(() => {
    fetch(baseUrl + 'api/getSpecificUserLoad?id_user=' + window.location.href.split("=")[1])
      .then(response => response.json())
      .then(data => setData(data));
 }, []);


// Préparation des données pour le graphique
//  const labels = data.map(item => item.Date);
//  const atlData = data.map(item => item.ATL);

 const chartData = {
    // labels: labels,
    // labels: data.map((item) => new Date(item.Date).toLocaleDateString()), // Format dates for labels
    labels: data.map(item => {
      const date = new Date(item.Date);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
    }),
    datasets: [
      {
        label: 'ATL',
        // data: atlData,
        data: data.map(item => item.ATL),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.8)',
        tension: 0.3,
        pointRadius: 1.5,
      },
      {
        label: 'CTL',
        // data: atlData,
        data: data.map(item => item.CTL),
        fill: false,
        backgroundColor: 'rgb(0, 192, 0)',
        borderColor: 'rgba(75, 192, 0, 0.8)',
        tension: 0.3,
        pointRadius: 1.5,
      },
      {
        label: 'TSB',
        // data: atlData,
        data: data.map(item => item.TSB),
        fill: false,
        backgroundColor: 'rgb(0, 0, 192)',
        borderColor: 'rgba(0, 0, 192, 0.8)',
        tension: 0.3,
        pointRadius: 1.5,
      },
        // {
        //   label: '',
        //   // data: atlData,
        //   data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //   fill: true,
        //   backgroundColor: 'rgb(1, 1, 1, 0)',
          
        //   borderColor: 'rgba(0, 0, 0, 1)',
        // },
    ],
 };

 return (
    <div>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
 );
}
export async function getServerSideProps() {
  // fetch env.local variables named DEBUG_MODE
console.log(process.env.DEBUG_MODE);
  return {
    props: { DEBUG_MODE: process.env.DEBUG_MODE },
  };
}