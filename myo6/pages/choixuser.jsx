import withAuth from '../components/withAuth';
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

//import "@fontsource/poppins";

import Footer from '../components/Footer'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'

import { useEffect, useState } from 'react'

function Home(props) {
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
        <Navbar />
        <hr className="w-full h-[4px] bg-beige"></hr>
        <div className='flex  min-h-[calc(100%-68px)] bg-gray-300 h-auto '>
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
                      src={"/assets/icons/user.svg"}
                      className="w-24 h-24 rounded-full mb-2"
                    />
                    <h3 className="text-lg font-semibold">
                      {user.firstname} {user.lastname}
                    </h3>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  console.log(process.env.DEBUG_MODE);
  return {
    props: { DEBUG_MODE: process.env.DEBUG_MODE },
  };
}

// Wrap the Home component with withAuth before exporting
export default withAuth(Home);
