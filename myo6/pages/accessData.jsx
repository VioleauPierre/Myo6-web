import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';

function Home(props) {
    const baseUrl = props.DEBUG_MODE === 'true' 
        ? "http://localhost:3000/"
        : "https://myo6-web.vercel.app/";

    const [userList, setUserList] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [videoData, setVideoData] = useState({ dates: [], ids: [] });
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [downloadStatus, setDownloadStatus] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [roleFilter, setRoleFilter] = useState('euromov');

    // Téléchargement du fichier vidéo spécifique
    const downloadVideoFile = async (videoId) => {
        setDownloadStatus(prev => ({ ...prev, [videoId]: 'loading' }));
        setErrorMessage('');

        try {
            const response = await fetch(`https://myo6.duckdns.org/api/video/${videoId}/video.mp4`);
            if (response.ok) {
                // Télécharger directement le fichier MP4
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                // Créer un lien de téléchargement
                const a = document.createElement('a');
                a.href = url;
                a.download = `video_${videoId}.mp4`;
                document.body.appendChild(a);
                a.click();

                // Nettoyer
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                setDownloadStatus(prev => ({ ...prev, [videoId]: 'success' }));
                setTimeout(() => {
                    setDownloadStatus(prev => ({ ...prev, [videoId]: null }));
                }, 2000);
            } else {
                throw new Error('Erreur lors du téléchargement du fichier vidéo');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setDownloadStatus(prev => ({ ...prev, [videoId]: 'error' }));
            setErrorMessage(`Erreur lors du téléchargement de la vidéo ${videoId}`);
            setTimeout(() => {
                setDownloadStatus(prev => ({ ...prev, [videoId]: null }));
            }, 2000);
        }
    };

    // Gestion de la sélection des vidéos pour télécharger tous les fichiers vidéo
    const handleDownloadSelectedVideos = async () => {
        if (selectedVideos.length === 0) {
            setErrorMessage('Veuillez sélectionner au moins une vidéo');
            return;
        }

        for (const videoId of selectedVideos) {
            await downloadVideoFile(videoId);
        }
    };

    // Récupération de la liste des utilisateurs
    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await fetch('https://myo6.duckdns.org/api/get_user_list_euromov');
                if (response.ok) {
                    const data = await response.json();
                    setUserList(data.ID_list);
                } else {
                    setErrorMessage('Erreur lors de la récupération de la liste des utilisateurs');
                }
            } catch (error) {
                setErrorMessage('Une erreur s\'est produite lors de la récupération de la liste des utilisateurs');
            }
        };

        fetchUserList();
    }, []);

    // Récupération des vidéos de l'utilisateur sélectionné
    useEffect(() => {
        const fetchUserVideos = async () => {
            if (!selectedUserId) return;

            setIsLoading(true);
            setErrorMessage('');
            try {
                const response = await fetch(`https://myo6.duckdns.org/api/${selectedUserId}/get_id_video_list`);
                if (response.ok) {
                    const data = await response.json();
                    setVideoData({
                        dates: data.user_date_record_list || [],
                        ids: data.user_id_video_list || []
                    });
                } else {
                    setErrorMessage('Erreur lors de la récupération des vidéos');
                }
            } catch (error) {
                setErrorMessage('Une erreur s\'est produite lors de la récupération des vidéos');
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedUserId) {
            fetchUserVideos();
            setSelectedVideos([]);
            setDownloadStatus({});
        } else {
            setVideoData({ dates: [], ids: [] });
        }
    }, [selectedUserId]);

    // Formater la date pour l'affichage
    // const formatDate = (dateString) => {
    //     const date = new Date(dateString);
    //     return new Intl.DateTimeFormat('fr-FR', {
    //         day: '2-digit',
    //         month: '2-digit',
    //         year: 'numeric',
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         second: '2-digit'
    //     }).format(date);
    // };

    const formatDate = (dateString) => {
        // Si la date est déjà sous forme de chaîne, vous pouvez simplement la retourner
        return dateString;
    };

    // Gestion de la sélection des vidéos
    const handleVideoSelection = (videoId) => {
        setSelectedVideos(prev => {
            if (prev.includes(videoId)) {
                return prev.filter(id => id !== videoId);
            } else {
                return [...prev, videoId];
            }
        });
    };

    // Téléchargement des données d'une vidéo spécifique
    const downloadVideoData = async (videoId) => {
        setDownloadStatus(prev => ({ ...prev, [videoId]: 'loading' }));
        setErrorMessage('');

        try {
            const isCommotion = roleFilter === 'commotion';
            const extension = isCommotion ? 'csv' : 'xlsx';
            const response = await fetch(`https://myo6.duckdns.org/api/video/${videoId}/data_${extension}`);

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                // Créer un lien de téléchargement
                const a = document.createElement('a');
                a.href = url;
                a.download = `video_${videoId}_data.${extension}`; // Save as an Excel file
                document.body.appendChild(a);
                a.click();

                // Nettoyer
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                setDownloadStatus(prev => ({ ...prev, [videoId]: 'success' }));
                setTimeout(() => {
                    setDownloadStatus(prev => ({ ...prev, [videoId]: null }));
                }, 2000);
            } else {
                throw new Error('Erreur lors du téléchargement');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setDownloadStatus(prev => ({ ...prev, [videoId]: 'error' }));
            setErrorMessage(`Erreur lors du téléchargement des données pour la vidéo ${videoId}`);
            setTimeout(() => {
                setDownloadStatus(prev => ({ ...prev, [videoId]: null }));
            }, 2000);
        }
    };

    // Téléchargement des données pour toutes les vidéos sélectionnées
    const handleDownloadSelected = async () => {
        if (selectedVideos.length === 0) {
            setErrorMessage('Veuillez sélectionner au moins une vidéo');
            return;
        }

        for (const videoId of selectedVideos) {
            await downloadVideoData(videoId);
        }
    };

    // Filtrer les utilisateurs par rôle
    const filteredUsers = userList.filter(user => 
        roleFilter === 'all' || user.role === roleFilter
    );
    // Téléchargement de toutes les données d'un utilisateur en un seul fichier
    const uniqueVideoEntries = Array.from(
        new Map(
            videoData.ids.map((id, index) => [id, { id, date: videoData.dates[index] }])
        ).values()
    );

    const downloadAllUserData = async () => {
        if (!selectedUserId) {
            setErrorMessage('Veuillez d\'abord sélectionner un utilisateur');
            return;
        }
    
        setErrorMessage('');
        setDownloadStatus(prev => ({ ...prev, all: 'loading' }));
    
        try {
            const response = await fetch(`https://myo6.duckdns.org/api/user/${selectedUserId}/all_data_xlsx`);
    
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `user_${selectedUserId}_all_data.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
    
                setDownloadStatus(prev => ({ ...prev, all: 'success' }));
                setTimeout(() => {
                    setDownloadStatus(prev => ({ ...prev, all: null }));
                }, 2000);
            } else {
                throw new Error('Erreur lors du téléchargement');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setErrorMessage(`Erreur lors du téléchargement de toutes les données de l'utilisateur`);
            setDownloadStatus(prev => ({ ...prev, all: 'error' }));
            setTimeout(() => {
                setDownloadStatus(prev => ({ ...prev, all: null }));
            }, 2000);
        }
    };

    return (
        <>
            <Header />
            <div className="h-screen w-screen">
                <Navbar />
                <hr className="w-full h-[4px] bg-beige" />

                <div className='flex min-h-[calc(100%-84px)] bg-gray-300 h-auto'>
                    <div id="main_code" className="h-full w-full">
                        <div className="w-full p-2">
                            <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center">
                                <div className="text-xl font-bold text-[#082431]">
                                    Accès Data
                                </div>
                            </div>
                        </div>

                        {/* Sélection de l'utilisateur avec filtre de rôle */}
                        <div className="w-full sm:w-1/2 p-2 justify-center items-center ml-auto mr-auto">
                            <div className="bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2">
                                <p className="mb-2 font-semibold">Filtrer par rôle :</p>
                                <div className="flex justify-center space-x-4 mb-2">
                                    <label>
                                        <input type="radio" value="euromov" checked={roleFilter === 'euromov'} onChange={() => setRoleFilter('euromov')} /> Phase 1
                                    </label>
                                    <label>
                                        <input type="radio" value="euromov_p2" checked={roleFilter === 'euromov_p2'} onChange={() => setRoleFilter('euromov_p2')} /> Phase 2
                                    </label>
                                    <label>
                                        <input type="radio" value="commotion" checked={roleFilter === 'commotion'} onChange={() => setRoleFilter('commotion')} /> Commotion
                                    </label>
                                </div>
                                <p className="mb-2 font-semibold">Sélectionnez un utilisateur :</p>
                                <select
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    className="w-full max-w-md p-2 border rounded"
                                >
                                    <option value="">-- Choisir un utilisateur --</option>
                                    {filteredUsers.map(user => (
                                        <option key={user.id_user} value={user.id_user}>
                                            {user.firstname} {user.lastname} (ID: {user.id_user})
                                        </option>
                                    ))}
                                </select>
                                    <button
                                        onClick={downloadAllUserData}
                                        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded shadow hover:bg-blue-700 transition"
                                    >
                                        Télécharger toutes les données de l&apos;utilisateur
                                    </button>
                            </div>
                        </div>

                         {/* Liste des vidéos avec leurs dates */}
                         {selectedUserId && (
                             <div className="w-full sm:w-3/4 p-2 justify-center items-center ml-auto mr-auto">
                                 <div className="bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-4">
                                 <div className="flex justify-between items-center mb-4">
                                   <h3 className="text-lg font-semibold">
                                       Enregistrements disponibles :
                                       {videoData.ids.length > 0 && 
                                           ` (${selectedVideos.length} sélectionné${selectedVideos.length > 1 ? 's' : ''})`
                                       }
                                   </h3>
                                   <div className="space-x-2">
                                       {/* Télécharger la sélection des données */}
                                       {selectedVideos.length > 0 && (
                                           <button
                                               onClick={handleDownloadSelected}
                                               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                           >
                                               Télécharger la sélection (Données)
                                           </button>
                                       )}
                                       {/* Télécharger la sélection des vidéos */}
                                       {selectedVideos.length > 0 && (
                                           <button
                                               onClick={handleDownloadSelectedVideos}
                                               className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                           >
                                               Télécharger la sélection (Vidéos)
                                           </button>
                                       )}
                                   </div>
                               </div>
 
                                     {isLoading ? (
                                         <div className="text-center py-4">Chargement...</div>
                                     ) : videoData.ids.length > 0 ? (
                                         <div className="space-y-2">
                                             {uniqueVideoEntries.map((entry) => (
                                    <div key={entry.id} className={`flex items-center justify-between p-3 rounded transition-colors duration-200`}>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedVideos.includes(entry.id)}
                                                onChange={() => handleVideoSelection(entry.id)}
                                                className="mr-4 h-5 w-5 text-blue-600"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    Enregistrement #{entry.id}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    Date : {formatDate(entry.date)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            {/* Téléchargement des données */}
                                            <button
                                                onClick={() => downloadVideoData(entry.id)}
                                                className={`px-3 py-1 rounded text-white transition-colors ${
                                                    downloadStatus[entry.id] === 'loading'
                                                        ? 'bg-gray-400'
                                                        : downloadStatus[entry.id] === 'success'
                                                        ? 'bg-green-500'
                                                        : downloadStatus[entry.id] === 'error'
                                                        ? 'bg-red-500'
                                                        : 'bg-blue-500 hover:bg-blue-600'
                                                }`}
                                                disabled={downloadStatus[entry.id] === 'loading'}
                                            >
                                                {downloadStatus[entry.id] === 'loading'
                                                    ? 'Téléchargement...'
                                                    : downloadStatus[entry.id] === 'success'
                                                    ? 'Données téléchargées'
                                                    : downloadStatus[entry.id] === 'error'
                                                    ? 'Erreur'
                                                    : 'Télécharger données'}
                                            </button>

                                            {/* Téléchargement vidéo */}
                                            <button
                                                onClick={() => downloadVideoFile(entry.id)}
                                                className={`px-3 py-1 rounded text-white transition-colors ${
                                                    downloadStatus[entry.id] === 'loading'
                                                        ? 'bg-gray-400'
                                                        : downloadStatus[entry.id] === 'success'
                                                        ? 'bg-green-500'
                                                        : downloadStatus[entry.id] === 'error'
                                                        ? 'bg-red-500'
                                                        : 'bg-blue-500 hover:bg-blue-600'
                                                }`}
                                                disabled={downloadStatus[entry.id] === 'loading'}
                                            >
                                                {downloadStatus[entry.id] === 'loading'
                                                    ? 'Téléchargement...'
                                                    : downloadStatus[entry.id] === 'success'
                                                    ? 'Vidéo téléchargée'
                                                    : downloadStatus[entry.id] === 'error'
                                                    ? 'Erreur'
                                                    : 'Télécharger vidéo'}
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                         </div>
                                     ) : (
                                         <div className="text-center py-4 text-gray-600">
                                             Aucun enregistrement disponible pour cet utilisateur
                                         </div>
                                     )}
                                 </div>
                             </div>
                         )}
 
                         {/* Messages d'erreur et de succès */}
                         <div className="flex w-full p-2 justify-center items-center">
                             {errorMessage && (
                                 <div className="bg-red-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">
                                     {errorMessage}
                                 </div>
                             )}
                             {successMessage && (
                                 <div className="bg-green-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">
                                     {successMessage}
                                 </div>
                             )}
                         </div>
                     </div>
                 </div>
             </div>
         </>
     );
 }
 
 export async function getServerSideProps() {
     return {
         props: { DEBUG_MODE: process.env.DEBUG_MODE || 'false' },
     };
 }

 export default Home;