import Header from '../components/Header'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'

import { useEffect } from 'react'
import { useState } from 'react'

export default function Home(props) {

  let baseUrl = "s";
  if (props.DEBUG_MODE === 'true') {
    baseUrl = "http://localhost:3000/";
    console.log("DEBUG_MODE");
  } else {
    baseUrl = "https://myo6-web.vercel.app/";
    console.log(baseUrl);
  }

  const [users, setUsers] = useState([]);
  const [videos, setVideo] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);
  const [selectedValueMeasure, setSelectedValueMeasure] = useState(0);
  const [currentUserid, setCurrentUserid] = useState(0);

  // const [isDataLoaded, setIsDataLoaded] = useState(false); QUENTIN

  const [isBilanSelected, setIsBilanSelected] = useState(true);
  const [isVideo, setIsVideo] = useState(true);

//récupérer les utilisateurs
  async function getUser() {
    const res = await fetch(baseUrl + 'api/getAllUser', {});
    //const res = await fetch('http://localhost:3000/api/getUsers_Test', {});

    const data = await res.json();
    setUsers(data);
  }
//récupérer les vidéos de l'utilisateur
  async function getVideo(userId) {
     const baUrl = "http://141.145.200.146:5000/api/";

    try {
      const url = `${baUrl}${userId}/get_all_videos_data`;

      const response = await fetch(url);
      if (!response.ok) {

        throw new Error('Erreur lors de la récupération des données.');
      }else{
        const video = await response.json();
        console.log("video", video);
        if(video.length > 0){
          console.log("video", video);
          setVideo(video);
          setSelectedValueMeasure(video[0].id_video);
          setIsVideo(true);
          // setIsDataLoaded(true); QUENTIN////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
        else{
          setIsVideo(false);
        }
        // setVideo(video);
        // setSelectedValueMeasure(video[0].id_video);
        // setIsDataLoaded(true); QUENTIN

      }
     
    } catch (error) {
      // setIsDataLoaded(false); QUENTIN
      console.error('Erreur:', error);
    }
  }
//remplir la seconde liste déroulante quand on sélectionne un utilisateur
  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedValue(selectedOption);
    setVideo([]);
    getVideo(selectedOption);
  };

  const handleSelectChangeMeasure = (event) => {
    const selectedOption = event.target.value;
    console.log(selectedOption);
    setSelectedValueMeasure(selectedOption);
  };

  

  //initialisation des données de la page
  useEffect(() => {
    if (window.location.href.split("=")[1] == undefined) {
      // redirect to /index
      //window.location.href = '/'
      // alert("Ceci est une alerte !");
    } else {
      setCurrentUserid(window.location.href.split("=")[1])
      setSelectedValue(window.location.href.split("=")[1]);
      setSelectedValueMeasure(0);
      setVideo([]);
      getVideo(window.location.href.split("=")[1]);
      getUser();
    }
  }, []);

  return (
    <>
      <Header></Header>
      <div className="h-screen w-screen">
        <Navbar></Navbar>
        <hr className="w-full h-[4px] bg-beige"></hr>
      {
        // !isDataLoaded ? QUENTIN
        // null
        // :

        <div className='flex  min-h-[calc(100%-84px)] bg-gray-300 h-auto '>
          {/* <SideBar></SideBar> */}
          <div id="main_code" className="h-full  w-full ">
            <select value={selectedValue} onChange={handleSelectChange} className="bg-white rounded-lg m-4 w-auto shadow-xl border-2 border-gray-400 text-lg">
              {users.map(user => (
                <option key={user.id_user} value={user.id_user}>
                  {user.firstname} {user.lastname}
                </option>
              ))}
            </select>

            {videos.length > 0 && (
            <select value={selectedValueMeasure} onChange={handleSelectChangeMeasure} className="bg-white rounded-lg m-4 w-auto shadow-xl border-2 border-gray-400 text-lg">

              {videos.map(video => (
                <option key={video.id_video} value={video.id_video}>
                  {video.date_record} {video.id_video}
                </option>
              ))}
            </select>
            )}

            <div className="w-full flex h-10 bg-red-300">

              <button className="w-1/2 bg-gray-500 hover:bg-gray-400 h-full flex justify-center items-center justify-items-center text-white transition duration-500 ease-in-out"
                onClick={() => setIsBilanSelected(true)}>
                  Bilan
              </button>

              <div className="w-1 bg-black h-full">

              </div>

              <button className="w-1/2 bg-gray-500 hover:bg-gray-400 h-full flex justify-center items-center justify-items-center text-white transition duration-500 ease-in-out"
                onClick={() => setIsBilanSelected(false)}>
                  Voir Les Mesures
              </button>

            </div>

            {
              isBilanSelected ? 
              <div className='p-2'>
              <div className="flex ">
                <div className="bg-white rounded-lg w-1/4 h-1/2 m-1 shadow-xl border-2 border-gray-400">
                  <div className="justify-center items-center justify-items-center h-full text-center">
                    <div className="text-2xl font-bold text-[#082431] flex justify-center items-center h-full">
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
                    <div className="text-2xl font-bold text-[#082431] flex justify-center items-center h-full">
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
                    <div className="text-2xl font-bold text-[#082431] flex justify-center items-center h-full">
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
                    <div className="text-2xl font-bold text-[#082431] flex justify-center items-center h-full">
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

              <div className="flex ">

                   <div className="flex h-96  w-1/2 mt-3 m-1 bg-white rounded-lg justify-center items-center justify-items-center shadow-xl border-2 border-gray-400">
               {/* <iframe src={"http://localhost:3000/testGraph5"} width="90%" height="100%" frameBorder="0" allowFullScreen></iframe> */}
               <iframe src={baseUrl + 'testGraph6?id_user='+ selectedValue } width="100%" height="100%" frameBorder="0" allowFullScreen></iframe>

               </div>


               <div className="flex h-96  w-1/2 mt-3 m-1 bg-white rounded-lg justify-center items-center justify-items-center shadow-xl border-2 border-gray-400">
               {/* <iframe src={"http://localhost:3000/testGraph5"} width="90%" height="100%" frameBorder="0" allowFullScreen></iframe> */}
               <iframe src={baseUrl + 'graphHooper?id_user='+ selectedValue } width="100%" height="100%" frameBorder="0" allowFullScreen></iframe>

               </div>

               {/* <div className="flex h-96 w-1/2 mt-3 m-1 bg-white rounded-lg justify-center items-center justify-items-center shadow-xl border-2 border-gray-400">
               <iframe src={"http://localhost:3000/UserWeb"} width="100%" height="100%" frameBorder="0" allowFullScreen></iframe>
               </div> */}

               </div>


               <div className="flex h-96 w-1/2 mt-3 m-1 bg-white rounded-lg justify-center items-center justify-items-center shadow-xl border-2 border-gray-400">
               <iframe src={baseUrl + 'UserWeb'} width="100%" height="100%" frameBorder="0" allowFullScreen></iframe>
               </div>


               {/* <div className="flex h-96  w-1/2 mt-3 m-1 bg-white rounded-lg justify-center items-center justify-items-center shadow-xl border-2 border-gray-400">
               <iframe src={"http://localhost:3000/graphHooper?id_user="+ selectedValue } width="80%" height="100%" frameBorder="0" allowFullScreen></iframe>
               </div> */}
               {/* <div className="flex">

                   <div className="flex h-96 w-1/2 mt-6 m-4 bg-white rounded-lg justify-center items-center justify-items-center shadow-xl border-2 border-gray-400">
                   <iframe src={"http://localhost:3000/testGraph6?id_user="+ selectedValue } width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
               </div>

               

               </div> */}
                </div>




              :
              isVideo ? 
              (
              <div className='h-screen'>
              <iframe src={"http://localhost:3000/directMesureEmbeded?video_id="+ selectedValueMeasure } width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
              </div>
              ) : (
              <div className="flex w-full mt-3 m-1 justify-center items-center justify-items-center">
                Pas de vidéo pour cet utilisateur
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