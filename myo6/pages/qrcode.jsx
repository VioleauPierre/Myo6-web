import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

//import "@fontsource/poppins";

import Footer from '../components/Footer'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import { Component } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import QRCode from 'qrcode.react';


export default function Home({  }) {


    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [encryption, setEncryption] = useState('');
  
  
    const handleGenerateQR = () => {
      const wifiCredentials = `WIFI:T:${encryption};S:${ssid};P:${password};H:;`;
      return wifiCredentials;
    };



  return (
    <>
    {/* <div className="flex-container"> */}
      <Header></Header>
      {/* <div className="scrollable-content"> */}
      <div className="h-screen w-screen">
        <Navbar></Navbar>
        <hr className="w-full h-[4px] bg-beige"></hr>
        <div className='flex  min-h-[calc(100%-68px)] bg-gray-300 h-auto '>
          {/* <SideBar></SideBar> */}
          <div id="main_code" className="h-full  w-full ">
            <div className="w-full p-2 ">
              <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-fit">
                <div className="text-xl font-bold text-[#082431]">
                Générateur de QR Code Wi-Fi
                </div>
              </div>
            </div>




            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">


      <p> SSID: </p>
  
      <input
        type="text"
        value={ssid}
        onChange={(e) => setSsid(e.target.value)}
        placeholder="Saisissez votre réponse"
        style={{ width: '190px' }}
      />
    </div>
    </div>



    <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">


      <p> Mot de passe : </p>
  
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Saisissez votre réponse"
        style={{ width: '190px' }}
      />
    </div>
    </div>



    <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">


      <p> Type de cryptage: </p>
  
      <select
          id="encryption"
          value={encryption}
          onChange={(e) => setEncryption(e.target.value)}
        >
          <option value="">Sélectionner</option>
          <option value="WPA">WPA</option>
          <option value="WEP">WEP</option>
          <option value="nopass">Aucun</option>
        </select>
    </div>
    </div>


    <div className="w-fit p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">

        <QRCode value={handleGenerateQR()}/>
      </div>
      </div>

          </div>

          
          
        </div>
      </div>
    </>
  )
}
