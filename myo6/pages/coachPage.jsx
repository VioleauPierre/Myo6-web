import withAuth from '../components/withAuth';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function Home(props) {
  const router = useRouter();
  const { id_user } = router.query; // get the user id from the URL
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null); // Store the user's role

  const baseUrl = props.DEBUG_MODE === 'true' ? "http://localhost:3000/" : "https://myo6-web.vercel.app/";

  const [users, setUsers] = useState([]);
  const [videos, setVideo] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);
  const [selectedValueMeasure, setSelectedValueMeasure] = useState(0);
  const [isBilanSelected, setIsBilanSelected] = useState(true);
  const [isVideo, setIsVideo] = useState(true);
  const [newTabSelected, setNewTabSelected] = useState(false);
  const [isQuestionnaireSelected, setIsQuestionnaireSelected] = useState(false);

  // Retrieve the logged-in user ID and role (for example from session storage)
  useEffect(() => {
    const loggedInUserId = sessionStorage.getItem('id_user');
    const loggedInUserRole = sessionStorage.getItem('role'); // Retrieve the role of the user
    setCurrentUserId(loggedInUserId);
    setCurrentUserRole(loggedInUserRole);

    // Ensure the logged-in athlete can only access their own data
    if (loggedInUserId && id_user && loggedInUserId !== id_user && loggedInUserRole !== 'admin') {
      alert("You are not authorized to access this page.");
      router.replace(`/coachPage?id_user=${loggedInUserId}`); // redirect them to their own page
    }
  }, [id_user, router]);

  // Fetch user data
  async function getUser() {
    const res = await fetch(baseUrl + 'api/getAllUser', {});
    const data = await res.json();
    const loggedInUserId = Number(sessionStorage.getItem('id_user'));
    const loggedInUserRole = sessionStorage.getItem('role'); // Retrieve the role of the user
    setCurrentUserId(loggedInUserId);
    setCurrentUserRole(loggedInUserRole);

    if (loggedInUserRole !== 'admin') {
        // Set a single user based on `currentUserId` in an array
        setUsers([data.find(user => user.id_user === loggedInUserId)]);
    } else {
        // Set all users if the condition is not met
        setUsers(data);
    }
}

  // Initial data loading and validation
  useEffect(() => {
    if (id_user) {
      setSelectedValue(id_user);
      setSelectedValueMeasure(0);
      setVideo([]);
      getUser();
    }
  }, [id_user]);

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedValue(selectedOption);
    setVideo([]);
  };



  return (
    <>
      <Header></Header>
      <div className="h-screen w-screen">
        <Navbar></Navbar>
        <hr className="w-full h-[4px] bg-beige"></hr>
      {

        <div className='flex  min-h-[calc(100%-84px)] bg-gray-300 h-auto '>
          {/* <SideBar></SideBar> */}
          <div id="main_code" className="h-full  w-full ">
            <select value={selectedValue} onChange={handleSelectChange} className="bg-white rounded-lg m-2 sm:m-4 w-auto shadow-xl border-2 border-gray-400 text-md sm:text-lg">
              {users.map(user => (
                <option key={user.id_user} value={user.id_user}>
                  {user.firstname} {user.lastname}
                </option>
              ))}
            </select>

            <div className="w-full flex h-10 bg-red-300">
              <button className="w-1/4 bg-gray-500 hover:bg-gray-400 h-full flex justify-center items-center justify-items-center text-white transition duration-500 ease-in-out text-xs md:text-sm lg:text-base xl:text-lg"
                onClick={() => {setIsBilanSelected(true); setNewTabSelected(false); setIsQuestionnaireSelected(false);}}>
                Bilan
              </button>

              <div className="w-1 bg-black h-full"></div>

              <button className="w-1/4 bg-gray-500 hover:bg-gray-400 h-full flex justify-center items-center justify-items-center text-white transition duration-500 ease-in-out text-xs md:text-sm lg:text-base xl:text-lg"
                onClick={() => {setIsBilanSelected(false); setNewTabSelected(false); setIsQuestionnaireSelected(false);}}>
                Mesures
              </button>

              <div className="w-1 bg-black h-full"></div>

              <button className="w-1/4 bg-gray-500 hover:bg-gray-400 h-full flex justify-center items-center justify-items-center text-white transition duration-500 ease-in-out text-xs md:text-sm lg:text-base xl:text-lg"
                onClick={() => {setIsBilanSelected(false); setNewTabSelected(true); setIsQuestionnaireSelected(false);}}>
                Activités
              </button>

              <div className="w-1 bg-black h-full"></div>

              <button className="w-1/4 bg-gray-500 hover:bg-gray-400 h-full flex justify-center items-center justify-items-center text-white transition duration-500 ease-in-out text-xs md:text-sm lg:text-base xl:text-lg"
                onClick={() => {setIsBilanSelected(false); setNewTabSelected(false); setIsQuestionnaireSelected(true);}}>
                Questionnaire
              </button>
            </div>


            {
              isBilanSelected ? (
              <div className='p-2'>
              <div className="flex ">
                <div className="bg-white rounded-lg w-1/4 h-1/2 m-1 shadow-xl border-2 border-gray-400">
                  <div className="justify-center items-center justify-items-center h-full text-center">
                    <div className="text-lg sm:text-2xl font-bold text-[#082431] flex justify-center items-center h-full">
                      <div className="flex flex-col justify-center items-center">
                      Athlète :
                        <div className="text-sm font-bold text-[#082431]">
                          
                          {users.find(user => user.id_user == selectedValue) && users.find(user => user.id_user == selectedValue).firstname} 
                          {" "}
                          {users.find(user => user.id_user == selectedValue) && users.find(user => user.id_user == selectedValue).lastname}   
                          {" "}                 
                          
                        
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="bg-white rounded-lg w-1/4 h-1/2 m-1 shadow-xl border-2 border-gray-400">
                  <div className="justify-center items-center justify-items-center h-full text-center">
                    <div className="text-lg sm:text-2xl font-bold text-[#082431] flex justify-center items-center h-full">
                      <div className="flex flex-col justify-center items-center">
                      Age : 
                        <div className="text-sm font-bold text-[#082431]">
                                      
                          {users.find(user => user.id_user == selectedValue) && users.find(user => user.id_user == selectedValue).age}
                          {" "}
                          ans
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg w-1/4 h-1/2 m-1 shadow-xl border-2 border-gray-400">
                  <div className="justify-center items-center justify-items-center h-full text-center">
                    <div className="text-lg sm:text-2xl font-bold text-[#082431] flex justify-center items-center h-full">
                      <div className="flex flex-col justify-center items-center">
                      Poids:
                        <div className="text-sm font-bold text-[#082431]">
                                      
                          {users.find(user => user.id_user == selectedValue) && users.find(user => user.id_user == selectedValue).weight}
                          {" "}
                          Kg
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg w-1/4 h-1/2 m-1 shadow-xl border-2 border-gray-400">
                  <div className="justify-center items-center justify-items-center h-full text-center">
                    <div className="text-lg sm:text-2xl font-bold text-[#082431] flex justify-center items-center h-full">
                      <div className="flex flex-col justify-center items-center">
                      Etat de forme:
                        <div className="text-sm font-bold text-[#082431]">
                                      
                          {users.find(user => user.id_user == selectedValue) && users.find(user => user.id_user == selectedValue).age}
                          {" "}
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                </div>

              <div className="sm:flex flex-col sm:flex-row">
  <div className="w-full sm:w-1/2 mt-3 m-1 bg-white rounded-lg flex justify-center items-center shadow-xl border-2 border-gray-400 h-96 sm:h-auto" style={{ aspectRatio: '16/9', maxHeight: '80vh' }}>
    <iframe src={baseUrl + 'graphTrainingLoad?id_user=' + selectedValue} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
  </div>

  <div className="w-full sm:w-1/2 mt-3 m-1 bg-white rounded-lg flex justify-center items-center shadow-xl border-2 border-gray-400 h-96 sm:h-auto" style={{ aspectRatio: '16/9', maxHeight: '80vh' }}>
    <iframe src={baseUrl + 'graphHooper?id_user='+ selectedValue } width="100%" height="100%" frameBorder="0" allowFullScreen></iframe>
  </div>
</div>

<div className="sm:flex flex-col sm:flex-row">
  <div className="w-full sm:w-1/3 mt-3 m-1 bg-white rounded-lg flex justify-center items-center shadow-xl border-2 border-gray-400 h-96 sm:h-auto" style={{ aspectRatio: '16/9', maxHeight: '80vh' }}>
    <iframe src={baseUrl + 'graphWeeklyRadar?id_user='+ selectedValue } width="100%" height="100%" frameBorder="0" allowFullScreen></iframe>
  </div>

  <div className="w-full sm:w-2/3 mt-3 m-1 bg-white rounded-lg flex justify-center items-center shadow-xl border-2 border-gray-400 h-96 sm:h-auto" style={{ aspectRatio: '16/9', maxHeight: '80vh' }}>
    <iframe src={baseUrl + 'graphWeekly?id_user='+ selectedValue } style={{ width: '100%', height: '100%', objectFit: 'contain' }} frameBorder="0" allowFullScreen></iframe>
  </div>
</div>
                </div>

               ) :
              newTabSelected ? (
              <div className='h-screen'>
              <iframe src={baseUrl+ "Activity2?user_id="+ selectedValue } width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
              </div>

              ) : isQuestionnaireSelected ? (
                <div className='h-screen'>
                  <iframe src={baseUrl + "questionnairec?user_id=" + selectedValue} width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
                </div>

               ) :
              isVideo ? 
              (
              <div className='h-screen'>
              <iframe src={baseUrl+ "MesureEmbeded?user_id="+ selectedValue } width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
              </div>
              ) : (
              <div className="flex w-full mt-3 m-1 justify-center items-center justify-items-center">
                Pas de données pour cet utilisateur
                </div>
              )
            }
            
          </div>
        </div>
       
      }    
      </div>
    </>
  )
}
export async function getServerSideProps() {
  // fetch env.local variables named DEBUG_MODE
console.log(process.env.DEBUG_MODE);
  return {
    props: { DEBUG_MODE: process.env.DEBUG_MODE },
  };
}
// Wrap the Home component with withAuth before exporting
Home.displayName = 'Home';

export default withAuth(Home,['admin','athlete']);