import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement,
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement,
  Title, 
  Tooltip, 
  Legend
);

const TrainingLoadHistogram = () => {
  const [data, setData] = useState(null);
  const [daysToShow, setDaysToShow] = useState('14');

  useEffect(() => {
    fetch(`https://myo6.duckdns.org/api/${window.location.href.split("=")[1]}/get_training_load_data`)
      .then(response => response.text())
      .then(text => {
        const validJSONString = text.replace(/:\s*NaN/g, ': null');
        return JSON.parse(validJSONString);
      })
      .then(jsonData => setData(jsonData))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  if (!data) return <div>Loading...</div>;

  const filteredData = daysToShow === 'all' ? data : data.slice(-daysToShow);

  const chartData = {
    labels: filteredData.map(item => {
      const date = new Date(item.Date);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
    }),
    datasets: [
      {
        label: 'Training Strain',
        data: filteredData.map(item => item['Training Strain'] || 0),
        borderColor: 'rgb(255, 0, 0)', 
        backgroundColor: 'rgba(255, 0, 0, 1)',
        type: 'line',
        yAxisID: 'y',
        fill: false,
        tension: 0.4,
        pointRadius: 1.5
      },
      {
        label: 'Swim Load',
        data: filteredData.map(item => item['Swim load'] || 0),
        backgroundColor: 'rgb(0, 191, 255)',
        stack: 'Stack 1',
        yAxisID: 'y',
      },
      {
        label: 'Run Load',
        data: filteredData.map(item => item['Run load'] || 0),
        backgroundColor: 'rgb(255, 215, 0)',
        stack: 'Stack 1',
        yAxisID: 'y',
      },
      {
        label: 'Strength Load',
        data: filteredData.map(item => item['Strength load'] || 0),
        backgroundColor: 'rgb(50, 205, 50)',
        stack: 'Stack 1',
        yAxisID: 'y',
      },
      {
        label: 'Bike Load',
        data: filteredData.map(item => item['Bike load'] || 0),
        backgroundColor: 'rgb(148, 0, 211)',
        stack: 'Stack 1',
        yAxisID: 'y',
      },
      {
        label: 'VirtualRide Load',
        data: filteredData.map(item => item['VirtualRide load'] || 0),
        backgroundColor: 'rgb(255, 140, 0)',
        stack: 'Stack 1',
        yAxisID: 'y',
      },
      {
        label: 'Training Monotony',
        data: filteredData.map(item => item['Training Monotony'] || 0),
        backgroundColor: 'rgb(70, 130, 180)',
        yAxisID: 'y1',
        type: 'bar',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Training Load, Training Strain, and Training Monotony',
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Training Load & Strain'
        },
        stacked: true,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Training Monotony'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const handleDaysChange = (event) => {
    setDaysToShow(event.target.value);
  };

  return (
    <div className="w-full h-full p-1 box-border">
      <select value={daysToShow} onChange={handleDaysChange} className="mb-0 p-1 border rounded">
        <option value="all">Toutes les données</option>
        <option value="30">30 derniers jours</option>
        <option value="14">14 derniers jours</option>
        <option value="7">7 derniers jours</option>
      </select>
      <div className="w-full h-96 md:h-[90vh]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TrainingLoadHistogram;
