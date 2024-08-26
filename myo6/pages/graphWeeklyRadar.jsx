import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const RadarChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState('sitting');


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (window.location.href.split("=")[1] === undefined) {
          setError('Aucun utilisateur spécifié'); // Aucun utilisateur spécifié
          return;
        }
        setIdUser(window.location.href.split("=")[1]);

        const response = await fetch(`https://myo6.duckdns.org/api/${idUser}/spider_plot`);

        if (!response.ok) {
          setError('Pas de données'); // Lien invalide
          return;
        }

        const data = await response.json();

        const dataKeys = [
          'average_constriction_velocity',
          'average_dilation_velocity_75',
          'baseline',
          'min_area',
          'reaction_time',
          'time_plateau',
        ];

        const labelMapping = {
          'average_constriction_velocity': 'Vitesse de\nconstriction \nmoyenne',
          'average_dilation_velocity_75': 'Vitesse de\ndilatation \nmoyenne (75%)',
          'baseline': 'Baseline',
          'min_area': 'Surface\nminimale',
          'reaction_time': 'Temps de\nréaction',
          'time_plateau': 'Temps de\nplateau',
        };

        const datasets = [
          {
            label: 'Semaine',
            data: dataKeys.map((key) => data[selectedOption][`7_day_${key}`]),
            backgroundColor: 'rgba(0, 162, 235, 0.2)',
            borderColor: 'rgba(0, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Jour',
            data: dataKeys.map((key) => data[selectedOption][key]),
            backgroundColor: 'rgba(54, 255, 235, 0.2)',
            borderColor: 'rgba(54, 255, 235, 1)',
            borderWidth: 1,
          },
        ];

        setChartData({
          labels: dataKeys.map(key => labelMapping[key]),
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

  const options = {
    responsive: true,
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
          font: {
            size: 12,
          },
        },
        position: 'top',
      },
    },
    layout: {
      padding: -12,
    },
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.3)',
        },
        grid: {
          circular: true,
          color: 'rgba(0, 0, 0, 0.3)',
          display: true,
          drawOnChartArea: true,
          drawTicks: true,
          lineWidth: 1,
          tickColor: 'rgba(0, 0, 0, 0.3)',
          tickLength: 8,
          tickWidth: 1,
        },
        pointLabels: {
          font: {
            size: 11,
          },
          callback: function(value) {
            return value.split('\n');
          }
        },
        ticks: {
          display: true,
          color: 'rgba(0, 0, 0, 0.87)',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="p-1">
        <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="sitting">Assis</option>
          <option value="standing">Debout</option>
        </select>
      </div>
      {error ? (
        <p>{error}</p> // Afficher le message d'erreur si une erreur est présente
      ) : chartData ? (
        <Radar data={chartData} options={options} />
      ) : (
        <p>Chargement des données...</p> // Afficher un message de chargement si les données ne sont pas encore disponibles
      )}
    </div>
  );
};

export default RadarChart;