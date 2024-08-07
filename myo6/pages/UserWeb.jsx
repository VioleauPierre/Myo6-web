import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PolarAreaController, ArcElement, LineElement, PointElement } from 'chart.js';

Chart.register(PolarAreaController, RadialLinearScale, ArcElement, LineElement, PointElement);


const data = {
 labels: ['Min area', 'Max area', 'Max velocity constriction', 'Amplitude', 'Time m ', 'Reaction time'],
 datasets: [
    {
      label: 'Mike',
      data: [125, 98, 86, 99, 85, 65],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
    },
    {
      label: 'Lily',
      data: [115, 130, 130, 100, 90, 85],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
    },
    // Ajoutez d'autres datasets ici si nécessaire
 ]
};


const options = {
  scales: {
     r: {
       angleLines: {
         display: true,
         color: 'rgba(0, 0, 0, 1)',
       },
       grid: {
         circular: true,
         color: 'rgba(0, 0, 0, 1)',
         display: true,
         drawOnChartArea: true,
         drawTicks: true,
         lineWidth: 1,
         tickColor: 'rgba(0, 0, 0, 1)',
         tickLength: 8,
         tickWidth: 1,
       },
       ticks: {
         display: true,
         color: 'rgba(0, 0, 0, 0.87)',
         padding : 8,
         font: {
           size: 11,
         },
       },
     },
  },
 };


const RadarChartComponent = () => {
 return <Radar data={data} options={options}/>;
};

export default RadarChartComponent;