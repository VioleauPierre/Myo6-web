import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const DATASETS = [
  {
    id: 'cf-perpignan',
    title: 'Data CF Perpignan',
    description:
      'Historique des donnees pour CF Perpignan. Pas encore actif',
    metadataPath: '/exports/cf-perpignan.json',
    downloadPath: '/exports/cf-perpignan.csv',
    downloadName: 'cf-perpignan.csv',
  },
  {
    id: 'hopital',
    title: 'Data Hopital',
    description:
      'Exports CSV destines aux equipes hospitalieres.',
    metadataPath: '/exports/hopital.json',
    downloadPath: '/exports/hopital.csv',
    downloadName: 'hopital.csv',
  },
];

const DATE_FORMAT_OPTIONS = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
};

export default function DataExports() {
  const initialDatasetState = useMemo(() => {
    return DATASETS.reduce((acc, dataset) => {
      acc[dataset.id] = {
        lastUpdated: null,
        isLoadingMetadata: false,
        isDownloading: false,
        error: null,
      };
      return acc;
    }, {});
  }, []);

  const [datasetState, setDatasetState] = useState(initialDatasetState);

  useEffect(() => {
    DATASETS.forEach((dataset) => {
      fetchDatasetMetadata(dataset);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDatasetMetadata = async (dataset) => {
    setDatasetState((prev) => ({
      ...prev,
      [dataset.id]: {
        ...prev[dataset.id],
        isLoadingMetadata: true,
        error: null,
      },
    }));

    try {
      const response = await fetch(dataset.metadataPath);
      if (!response.ok) {
        throw new Error('Reponse metadata invalide');
      }

      const payload = await response.json();
      const lastUpdatedRaw = payload?.lastUpdate || payload?.lastUpdated;
      const lastUpdated = lastUpdatedRaw
        ? new Intl.DateTimeFormat('fr-FR', DATE_FORMAT_OPTIONS).format(
            new Date(lastUpdatedRaw),
          )
        : 'Non communique';

      setDatasetState((prev) => ({
        ...prev,
        [dataset.id]: {
          ...prev[dataset.id],
          lastUpdated,
          isLoadingMetadata: false,
          error: null,
        },
      }));
    } catch (error) {
      setDatasetState((prev) => ({
        ...prev,
        [dataset.id]: {
          ...prev[dataset.id],
          lastUpdated: null,
          isLoadingMetadata: false,
          error: "Metadata non disponible pour l'instant",
        },
      }));
    }
  };

  const handleDownload = async (dataset) => {
    setDatasetState((prev) => ({
      ...prev,
      [dataset.id]: {
        ...prev[dataset.id],
        isDownloading: true,
        error: null,
      },
    }));

    try {
      const response = await fetch(dataset.downloadPath);
      if (!response.ok) {
        throw new Error('Reponse fichier invalide');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = dataset.downloadName || `${dataset.id}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setDatasetState((prev) => ({
        ...prev,
        [dataset.id]: {
          ...prev[dataset.id],
          error: 'Erreur lors du telechargement. Verifiez le fichier CSV.',
        },
      }));
    } finally {
      setDatasetState((prev) => ({
        ...prev,
        [dataset.id]: {
          ...prev[dataset.id],
          isDownloading: false,
        },
      }));
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen w-screen bg-gray-200">
        <Navbar />
        <hr className="w-full h-[4px] bg-beige" />
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-xl border-2 border-gray-300 p-6 mb-6">
            <h1 className="text-2xl font-bold text-[#082431] mb-2">
              Portail des exports CSV
            </h1>
            <p className="text-gray-600">
              Utilisez les cadres ci-dessous pour suivre les mises a jour et
              telecharger les fichiers CSV. 
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {DATASETS.map((dataset) => {
              const datasetInfo = datasetState[dataset.id];
              return (
                <div
                  key={dataset.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-300 p-6 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-[#082431] mb-2">
                      {dataset.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{dataset.description}</p>

                    <div className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
                      <span className="text-sm font-medium text-gray-700">
                        Derniere mise a jour
                      </span>
                      <span className="text-sm text-gray-900">
                        {datasetInfo?.isLoadingMetadata
                          ? 'Chargement...'
                          : datasetInfo?.lastUpdated || 'En attente'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    {datasetInfo?.error && (
                      <div className="text-sm text-red-600">
                        {datasetInfo.error}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDownload(dataset)}
                      disabled={datasetInfo?.isDownloading}
                      className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                        datasetInfo?.isDownloading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#082431] hover:bg-[#0b2f45]'
                      }`}
                    >
                      {datasetInfo?.isDownloading
                        ? 'Telechargement...'
                        : 'Telecharger le CSV'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
