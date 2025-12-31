import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const DATASETS = [
  {
    id: 'cf-perpignan',
    title: 'Données CF Perpignan',
    description:
      'Historique des données pour CF Perpignan. Pas encore actif.',
    metadataPath: '/exports/cf-perpignan.json',
    downloadPath: '/exports/cf-perpignan.csv',
    downloadName: 'cf-perpignan.csv',
  },
  {
    id: 'hopital',
    title: 'Données Hôpital',
    description:
      'Exports CSV destinés aux équipes hospitalières.',
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

const AUTH_STORAGE_KEY = 'dataExportsAuth';
const AUTH_ID = 'commotion_pupillom\u00E9trie';
const AUTH_PASSWORD = 'pupil_com_2026_!';

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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [datasetState, setDatasetState] = useState(initialDatasetState);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    DATASETS.forEach((dataset) => {
      fetchDatasetMetadata(dataset);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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
        throw new Error('Réponse de métadonnées invalide');
      }

      const payload = await response.json();
      const lastUpdatedRaw = payload?.lastUpdate || payload?.lastUpdated;
      const lastUpdated = lastUpdatedRaw
        ? new Intl.DateTimeFormat('fr-FR', DATE_FORMAT_OPTIONS).format(
            new Date(lastUpdatedRaw),
          )
        : 'Non communiqué';

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
          error: "Métadonnées non disponibles pour l'instant",
        },
      }));
    }
  };

  const handleAuthSubmit = (event) => {
    event.preventDefault();

    const normalizedIdentifier = authIdentifier.trim();
    const isValid =
      normalizedIdentifier === AUTH_ID && authPassword === AUTH_PASSWORD;

    if (isValid) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setAuthError('');
      return;
    }

    setAuthError('Identifiant ou mot de passe incorrect.');
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
        throw new Error('Réponse du fichier invalide');
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
          error: 'Erreur lors du téléchargement. Vérifiez le fichier CSV.',
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

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen w-screen bg-gray-200">
          <Navbar />
          <hr className="w-full h-[4px] bg-beige" />
          <div className="w-full max-w-lg mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-xl border-2 border-gray-300 p-6">
              <h1 className="text-2xl font-bold text-[#082431] mb-2">
                Acces securise
              </h1>
              <p className="text-gray-600">
                Identifiez-vous pour acceder aux exports CSV.
              </p>
              <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="auth-identifier"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Identifiant
                  </label>
                  <input
                    id="auth-identifier"
                    type="text"
                    value={authIdentifier}
                    onChange={(event) => setAuthIdentifier(event.target.value)}
                    autoComplete="username"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="auth-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mot de passe
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    value={authPassword}
                    onChange={(event) => setAuthPassword(event.target.value)}
                    autoComplete="current-password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                {authError && (
                  <div className="text-sm text-red-600">{authError}</div>
                )}
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold text-white transition bg-[#082431] hover:bg-[#0b2f45]"
                >
                  Se connecter
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

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
              Utilisez les cadres ci-dessous pour suivre les mises à jour et
              télécharger les fichiers CSV.
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
                        Dernière mise à jour
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
                        ? 'Téléchargement...'
                        : 'Télécharger le CSV'}
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
