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
            {/* <div className="flex bg-white rounded-lg shadow-xl border-2 mb-6 border-gray-400 p-2 justify-center items-center justify-items-center ">
                <div className="text-xl font-bold text-[#082431]">
                    Mesure en Direct
                </div>
            </div> */}

            <div className='sm:flex sm:p-8 sm:ml-5'>
              <img src="/assets/images/logo.png" alt="Logo" className="w-auto rounded-md  " />
                  <div className="text-[#082431] p-8 text-justify justify-center items-center justify-items-center w-auto">
                  Innowide lance sa marque SportElevate dédiée à la performance 
                  sportive des athlètes de haut niveau par la conception et la commercialisation 
                  d’une gamme de dispositifs de mesure (IoT) et d’analyse de données par l’IA.
                  </div>
                  </div>


                  <div className='sm:flex sm:p-8 sm:ml-5'>
              
                  <div className="text-[#082431] w-auto p-8 sm:p-0 text-justify justify-center items-center justify-items-center">
                  La pupillométrie, méthode qui consiste à mesurer le diamètre de la pupille en 
                fonction de stimuli lumineux, est utilisée en médecine pour détecter certaines 
                pathologies et pour mesurer les éventuelles séquelles neurologiques d’un gros 
                choc sur la tête. Plusieurs études ont montré que la pupille est également 
                sensible à notre état de fatigue. Notre première solution nommée Myo6 est 
                un dispositif embarqué et une plateforme d’IA utilisant la pupillométrie dynamique 
                pour évaluer la fatigue des sportifs de haut niveau et leur permettre d’ajuster 
                au mieux leur entraînement.
                  </div>
                  <img src="/assets/images/pres1.png" alt="Logo" className="w-auto rounded-md sm:ml-5" />
                  </div>
            </div>


            
        </div>

      </div>      

    </div>
  </>
  )
}





{/* <div className="bg-black rounded-lg w-full m-6 h-1/4 shadow-xl ">
              <div className=" justify-center items-center justify-items-center h-full">
                <div className="text-2xl font-bold text-[#ffffff]">
                  Welcome to Myo6
                </div>

                <div className="flex">
                <img src="/assets/images/logo.png" alt="Logo" className="h-full rounded-md ml-5" />
                
                <div className=" text-[#ffffff] text-justify justify-center items-center justify-items-center">
                Innowide lance sa marque SportElevate dédiée à la performance 
                sportive des athlètes de haut niveau par la conception et la commercialisation 
                d’une gamme de dispositifs de mesure (IoT) et d’analyse de données par l’IA.
                </div>
                </div>

                <div className=" text-[#ffffff] text-justify justify-center items-center justify-items-center">

                La pupillométrie, méthode qui consiste à mesurer le diamètre de la pupille en 
                fonction de stimuli lumineux, est utilisée en médecine pour détecter certaines 
                pathologies et pour mesurer les éventuelles séquelles neurologiques d’un gros 
                choc sur la tête. Plusieurs études ont montré que la pupille est également 
                sensible à notre état de fatigue. Notre première solution nommée Myo6 est 
                un dispositif embarqué et une plateforme d’IA utilisant la pupillométrie dynamique 
                pour évaluer la fatigue des sportifs de haut niveau et leur permettre d’ajuster 
                au mieux leur entraînement.
                </div>
              </div>
              
            </div> */}