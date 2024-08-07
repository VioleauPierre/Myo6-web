import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const ComboChart = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedOption, setSelectedOption] = useState('baseline');
  const [idUser, setIdUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (window.location.href.split("=")[1] === undefined) {
          setError('Aucun utilisateur spécifié'); // Aucun utilisateur spécifié
          return;
        }
        setIdUser(window.location.href.split("=")[1]);

        const response = await fetch(`https://myo6.duckdns.org/api/${idUser}/${selectedOption}/weekly_plot`);

        if (!response.ok) {
          setError('Pas de données'); // Lien invalide
          return;
        }

        const data = await response.json();

        const dates = new Set();
        for (const section of Object.values(data)) {
          for (const item of section) {
            dates.add(new Date(item.Date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }));
          }
        }
        // const labels = Array.from(dates).sort();
        const labels = Array.from(dates);


        const datasets = [
////////////////////////////////////////////////Courbes////////////////////////////////////////
           {
             type: 'line',
             label: 'Moyenne glissante 7 jours Assis',
             data: data.sitting_morning.map((item) => item.rolling_mean_7),
             borderColor: 'rgba(255, 0, 0, 1)',
             backgroundColor: 'rgba(255, 0, 0, 1)',
             spanGaps: true,
             tension: 0.3,
             pointRadius: 2,
             fill: false,
           },
           {
             type: 'line',
             label: 'Moyenne glissante 7 jours Debout',
             data: data.standing_morning.map((item) => item.rolling_mean_7),
             borderColor: 'rgba(132, 0, 255, 1)',
             backgroundColor: 'rgba(132, 0, 255, 1)',
             spanGaps: true,
             tension: 0.3,
             pointRadius: 2,
             fill: false,
           },
///////////////////////////////////////Courbes 30 jours////////////////////////////////////////
            {
              type: 'line',
              data: data.sitting_morning.map((item) => item.lower_bound),
              borderColor: 'rgba(255, 128, 0, 0.2)',
              backgroundColor: 'rgba(255, 128, 0, 0.2)',
              spanGaps: true,
              tension: 0.3,
              pointRadius: 0,
              showLine: false,
              fill: false,
            },
            {
              type: 'line',
              data: data.sitting_morning.map((item) => item.upper_bound),
              borderColor: 'rgba(255, 128, 0, 0.2)',
              backgroundColor: 'rgba(255, 128, 0, 0.2)',
              spanGaps: true,
              tension: 0.3,
              pointRadius: 0,
              showLine: false,
              fill: +2,
            },
            {
              type: 'line',
              label: 'Baseline 30 jours Assis',
              data: data.sitting_morning.map((item) => item.rolling_mean_30),
              borderColor: 'rgba(255, 128, 0, 0.2)',
              backgroundColor: 'rgba(255, 128, 0, 0.2)',
              spanGaps: true,
              tension: 0.3,
              pointRadius: 0,
              showLine: false,
              fill: false,
            },
///////////////////////////////////////////////////////////////////////////////////////////////////
            {
              type: 'line',
              data: data.standing_morning.map((item) => item.lower_bound),
              borderColor: 'rgba(255, 0, 127, 0.2)',
              backgroundColor: 'rgba(255, 0, 127, 0.2)',
              spanGaps: true,
              tension: 0.3,
              pointRadius: 0,
              showLine: false,
              fill: false,
            },
            {
              type: 'line',
              data: data.standing_morning.map((item) => item.upper_bound),
              borderColor: 'rgba(255, 0, 127, 0.2)',
              backgroundColor: 'rgba(255, 0, 127, 0.2)',
              spanGaps: true,
              tension: 0.3,
              pointRadius: 0,
              showLine: false,
              fill: +5,
            },
            {
              type: 'line',
              label: 'Baseline 30 jours Debout',
              data: data.standing_morning.map((item) => item.rolling_mean_30),
              borderColor: 'rgba(255, 0, 127, 0.2)',
              backgroundColor: 'rgba(255, 0, 127, 0.2)',
              spanGaps: true,
              tension: 0.3,
              pointRadius: 0,
              showLine: false,
              fill: false,
            },
///////////////////////////////////////Histogramme////////////////////////////////////////
          {
            type: 'bar',
            label: 'Assis',
            data: data.sitting_morning.map((item) => item[selectedOption]),
            backgroundColor: 'rgba(0, 162, 235, 0.8)',
            borderColor: 'rgba(0, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            type: 'bar',
            label: 'Debout',
            data: data.standing_morning.map((item) => item[selectedOption]),
            backgroundColor: 'rgba(54, 255, 235, 0.8)',
            borderColor: 'rgba(54, 255, 235, 1)',
            borderWidth: 1,
          },
        ];

        setChartData({
          labels,
          datasets,
        });
        setError(null); // Réinitialiser l'erreur si les données ont été récupérées avec succès
      } catch (error) {
        setError('Erreur lors de la récupération des données'); // Erreur lors de la récupération des données
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, [selectedOption, idUser]);

  const labelsToHide = [,];
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Bilan hebdomadaire',
        font: {
          size: 20,
        },
      },
      legend: {
        labels: {
          filter: (item, data) => !labelsToHide.includes(item.text),
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    // <div style={{ width: '100%', height: '100%' }}>
    <div className="w-full h-full p-1 box-border">
      <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} className="mb-0 p-1 border rounded">
        <option value="baseline">Référence</option>
        <option value="min_area">Aire minimale</option>
        <option value="max_area_dilation">Aire maximale</option>
        <option value="amplitude">Différence d&apos;aire</option>
        <option value="reaction_time">Temps de réaction</option>
        <option value="time_constriction">Temps de constriction</option>
        <option value="time_plateau">Durée du plateau</option>
        <option value="time_75">Temps de récupération au 3/4</option>
        <option value="average_constriction_velocity">Vitesse moyenne de constriction</option>
        <option value="average_dilation_velocity">Vitesse moyenne de dilatation</option>
        <option value="average_dilation_velocity_75">Vitesse moyenne de dilatation aux 3/4</option>
        <option value="max_constriction_velocity">Vitesse maximale de constriction</option>
        <option value="max_dilation_velocity">Vitesse maximale de dilatation</option>
      </select>
      {error ? (
        <p>{error}</p> // Afficher le message d'erreur si une erreur est présente
      ) : chartData ? (
        <div className="w-full h-96 md:h-[91vh]">
        <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p>Chargement des données...</p> // Afficher un message de chargement si les données ne sont pas encore disponibles
      )}
    </div>
  );
};

export default ComboChart;