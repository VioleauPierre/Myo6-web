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
    baseUrl = "https://myo6-web.vercel.app/";
    console.log(baseUrl);
  }

  const [daysToShow, setDaysToShow] = useState('30');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'PRS 100 et RMSSD',
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
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'PRS 100',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'RMSSD',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  useEffect(() => {
    fetch(baseUrl + 'api/getSpecificUserHooper?id_user=' + window.location.href.split("=")[1])
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const filteredData = daysToShow === 'all' ? data : data.slice(-daysToShow);

  const allDataZeroOrNull = filteredData.every(item =>
    (item.prs_100 === 0 || item.prs_100 === null) &&
    (item.rmssd_lying === 0 || item.rmssd_lying === null)
  );

  const chartData = {
    labels: filteredData.map(item => {
      const date = new Date(item.Date);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
    }),
    datasets: [
      {
        label: 'PRS 100',
        data: filteredData.map(item => item.prs_100),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.8)',
        spanGaps: true,
        tension: 0.2,
        pointRadius: 1.5,
        yAxisID: 'y',
      },
      {
        label: 'RMSSD',
        data: filteredData.map(item => item.rmssd_lying),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.8)',
        spanGaps: true,
        tension: 0.2,
        pointRadius: 1.5,
        yAxisID: 'y1',
      },
    ],
  };

  const handleDaysChange = (event) => {
    setDaysToShow(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || data.length === 0 || allDataZeroOrNull) {
    return <div>Pas de données</div>;
  }

  return (
    <>
      <div className="w-full h-full p-1 box-border">
        <select value={daysToShow} onChange={handleDaysChange} className="mb-0 p-1 border rounded">
          <option value="all">Toutes les données</option>
          <option value="30">30 derniers jours</option>
          <option value="14">14 derniers jours</option>
          <option value="7">7 derniers jours</option>
        </select>
        <div className="w-full h-96 md:h-[91vh]">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </>
  );
}


export async function getServerSideProps() {
  console.log(process.env.DEBUG_MODE);
  return {
    props: { DEBUG_MODE: process.env.DEBUG_MODE },
  };
}
