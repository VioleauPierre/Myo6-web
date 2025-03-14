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

    const filteredUsers = userList.filter(user => 
        roleFilter === 'all' || user.role === roleFilter
    );

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
                            </div>
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
