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

export default function Home({  }) {

  return (
    <>
      <Header></Header>

      <div className=" h-screen w-screen">

        <Navbar></Navbar>

        <hr className="w-full h-[4px] bg-beige"></hr>

        <div className='flex  min-h-[calc(100%-84px)] bg-gray-300 h-auto '>
          {/* <SideBar></SideBar> */}
          <div id="main_code" className="h-full  w-full ">
            
          <div className=" w-full p-2 ">
            Version 1.0.0
            


          <div className=" flex w-fit p-6 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className=" bg-white rounded-lg shadow-xl border-2 mb-4 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                  <div className="text-xl font-bold text-[#082431] text-center">
                    Contact
                  </div>
                  <div className="text-lg font-bold text-[#082431]">
                    Tel : 01 89 62 36 72
                    <br></br>
                    Mail : contact@innowide.fr
                    <br></br>
                    Adresse : Chemin de Moulon, 91190 Gif-sur-Yvette
                    <br></br>
                    <div className="text-blue-500">
                    <a href="https://www.innowide.fr/">Innowide.fr</a>
                    </div>
                  </div>
                </div>
                </div>
           

            <div className=" flex w-fit p-6 justify-center items-center justify-items-center ml-auto mr-auto">
              <div className=" bg-white rounded-lg shadow-xl border-2 mb-4 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                  <div className="text-xl font-bold text-[#082431] text-center">
                    Nos réseaux sociaux
                  </div>

                  
                  <div className="text-lg font-bold text-[#082431]">
                    <div className="p-3">
      <a href="https://www.linkedin.com/company/innowide/" className="social-link">
        <img src="/assets/images/linkedin.svg" alt="Linkedin" />
      </a>
      </div>

      <div className="p-1">
      <a href="https://www.welcometothejungle.com/fr/companies/innowide" className="social-link">
        <img src="/assets/images/welcome-to-the-jungle.svg" alt="Welcome To The Jungle" />
      </a>
      </div>

      <div className="p-1">
      <a href="https://twitter.com/innowide91" className="social-link">
        <img src="/assets/images/twitter-x.svg" alt="X" />
      </a>
      </div>                    
                  </div>
                </div>
                </div>
          
                </div>

            
        </div>

      </div>      

    </div>
  </>
  )
}
