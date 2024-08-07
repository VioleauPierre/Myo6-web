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
    baseUrl = "https://myo6.vercel.app/";
    console.log(baseUrl);
  }

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(baseUrl + 'api/getSpecificUserLoadTest')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  const chartData = {
    labels: data.map((item) => new Date(item.Date).toLocaleDateString()),
    datasets: [
      {
        label: 'ATL',
        data: data.map(item => item.ATL),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.8)',
      },
      {
        label: 'CTL',
        data: data.map(item => item.CTL),
        fill: false,
        backgroundColor: 'rgb(0, 192, 0)',
        borderColor: 'rgba(75, 192, 0, 0.8)',
      },
      {
        label: 'TSB',
        data: data.map(item => item.TSB),
        fill: false,
        backgroundColor: 'rgb(0, 0, 192)',
        borderColor: 'rgba(0, 0, 192, 0.8)',
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Training Load',
        font: {
          size: 20,
        },
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x',
            value: "11/02/2024",
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
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
}

export async function getServerSideProps() {
  console.log(process.env.DEBUG_MODE);
  return {
    props: { DEBUG_MODE: process.env.DEBUG_MODE },
  };
}