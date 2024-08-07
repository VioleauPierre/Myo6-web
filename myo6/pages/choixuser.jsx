import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

//import "@fontsource/poppins";

import Footer from '../components/Footer'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'

import { useEffect } from 'react'
import { useState } from 'react'

export default function Home(props) {
  const [users, setUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [sortByName, setSortByName] = useState(true);
  console.log(props);


  let baseUrl = "s";
  if (props.DEBUG_MODE === 'true') {
    baseUrl = "http://localhost:3000/";
    console.log("DEBUG_MODE");
  } else {
    baseUrl = "https://myo6-web.vercel.app/";
    console.log(baseUrl);
  }



  async function getUser() {

    const res = await fetch(baseUrl + 'api/getAllUser', {
    //const res = await fetch('http://localhost:3000/api/getUsers_Test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    console.log(data);
    setUsers(data);
  }

  useEffect(() => {
    getUser()
  }, []);

  const sortUsers = () => {
    const sorted = [...users].sort((a, b) => {
      if (sortByName) {
        const fullNameA = `${a.firstname} ${a.lastname}`.toLowerCase();
        const fullNameB = `${b.firstname} ${b.lastname}`.toLowerCase();
        if (fullNameA < fullNameB) return -1;
        if (fullNameA > fullNameB) return 1;
        return 0;
      } else {
        return a.id_user - b.id_user;
      }
    });
    setSortedUsers(sorted);
    setSortByName(!sortByName);
  };


  return (
    <>
      <Header></Header>

      <div className="h-screen w-screen">
        <Navbar></Navbar>
        <hr className="w-full h-[4px] bg-beige"></hr>
        <div className='flex  min-h-[calc(100%-68px)] bg-gray-300 h-auto '>
          {/* <SideBar></SideBar> */}
          <div id="main_code" className="h-full  w-full ">
            <div className="w-full p-2 ">
              <div className="flex bg-white rounded-lg shadow-xl border-2 mb-6 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                <div className="text-xl font-bold text-[#082431]">
                  Choix Utilisateur
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: '24px', marginLeft: '20px' }}>Mon équipe</h2>
            <div className="flex justify-end mb-4 mr-4">
        <button
          className="bg-bleugris text-white font-bold py-2 px-4 rounded"
          onClick={sortUsers}
        >
          Trier par {sortByName ? 'nom' : 'ID'}
        </button>
      </div>

      <div className="flex flex-wrap justify-center">
        {sortedUsers.length > 0
          ? sortedUsers.map((user) => (
            <div
            key={user.id_user}
            className="bg-white rounded-lg shadow-md m-2 p-4 flex flex-col items-center cursor-pointer "
            onClick={() => {
              window.location.href = `/coachPage?id_user=${user.id_user}`;
            }}
          >
            <img
              // src={`/user-photos/${user.id_user}.jpg`}
              // alt={`${user.firstname} ${user.lastname}`}
              src={"/assets/icons/user.svg"}
              className="w-24 h-24 rounded-full mb-2"
            />
            <h3 className="text-lg font-semibold">
              {user.firstname} {user.lastname}
            </h3>
          </div>
            ))
          : users.map((user) => (
            <div
            key={user.id_user}
            className="bg-white rounded-lg shadow-md m-2 p-4 flex flex-col items-center cursor-pointer"
            onClick={() => {
              window.location.href = `/coachPage?id_user=${user.id_user}`;
            }}
          >
            <img
              // src={`/user-photos/${user.id_user}.jpg`}
              // alt={`${user.firstname} ${user.lastname}`}
              src={"/assets/icons/user.svg"}
              className="w-24 h-24 rounded-full mb-2"
            />
            <h3 className="text-lg font-semibold">
              {user.firstname} {user.lastname}
            </h3>
          </div>
            ))}
      </div>

            


            {/* <div className="flex flex-wrap justify-center">
  {users.map((user) => (
    <div
      key={user.id_user}
      className="bg-white rounded-lg shadow-md m-2 p-4 flex flex-col items-center cursor-pointer"
      onClick={() => {
        window.location.href = `/coachPage6?id_user=${user.id_user}`;
      }}
    >
      <img
        src={`/user-photos/${user.id_user}.jpg`}
        alt={`${user.firstname} ${user.lastname}`}
        className="w-24 h-24 rounded-full mb-2"
      />
      <h3 className="text-lg font-semibold">
        {user.firstname} {user.lastname}
      </h3>
    </div>
  ))}
</div>
 */}


            {/* <h2 style={{ fontSize: '24px', marginBottom: '50px', marginLeft: '20px' }}></h2>
            <table style={{ width: '99%', borderCollapse: 'collapse', margin: '20px   10px', fontSize: '0.9em', minWidth: '400px', boxShadow: '0   0   20px rgba(0,   0,   0,   0.15)' }}>
              <thead style={{ backgroundColor: '#009879', color: 'white' }}>
                <tr>
                  <th style={{ padding: '12px   15px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black', borderBottom: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '12px   15px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black', borderBottom: '1px solid #ddd' }}>First Name</th>
                  <th style={{ padding: '12px   15px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black', borderBottom: '1px solid #ddd' }}>Last Name</th>
                  <th style={{ padding: '12px   15px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black', borderBottom: '1px solid #ddd' }}>Age</th>
                  <th style={{ padding: '12px   15px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black', borderBottom: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: '12px   15px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black', borderBottom: '1px solid #ddd' }}>Weight</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id_user} style={{ borderBottom: '1px solid #ddd', padding: '12px   15px', cursor: 'pointer' }} 
                    onClick={ () => {window.location.href = `/coachPage6?id_user=` + user.id_user}}>
                    <td>
                      {user.id_user}
                    </td>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.age}</td>
                    <td>{user.email}</td>
                    <td>{user.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table> */}


            
          </div>
        </div>
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