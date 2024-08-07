import Head from "next/head";


import Link from "next/link";
import Image from "next/image";
import { useEffect } from 'react'
import { useState } from 'react'


export default function SideBar({setISideBarOpen}) {
    const [userId, setUserId] = useState([]);

    useEffect(() => {
        if (window.location.href.split("=")[1] == undefined) {
        } else {
          setUserId(window.location.href.split("=")[1])
        }
      }, []);

    return (         
        
            
        <div className="fixed top-0 left-0 h-full  bg-gray-500 min-w-[230px] z-10 ">
        

            <div className="p-2 ">

                <button className="text-lg p-1 font-light text-[#082431] " onClick={() => setISideBarOpen(false)}>
                    Menu
                </button>

                <div className="justify-center items-center justify-items-center text-white text-[12px]">
                    
                    <Link className=" shadow-md hover:shadow-xl  transition ease-in-out  duration-500 rounded bg-bleuclair py-2 px-4 my-3 w-full flex justify-start items-center justify-items-start "
                     href={`/?id_user=${userId}`}>               
                        <div className="">
                            <img src="/assets/icons/dash.svg" alt="Home" className="w-4 h-4 mr-1" />
                        </div>
                        Home
                    </Link>              
                </div>
               
                <div className="justify-center items-center justify-items-center  text-white text-[12px]">
                    
                    <Link className="shadow-md hover:shadow-xl  transition ease-in-out  duration-500  rounded bg-bleuclair py-2 px-4 my-3 w-full flex justify-start items-center justify-items-start "
                    href={`/choixuser?id_user=${userId}`}>
                        <div className="">
                            <img src="/assets/icons/documentation.svg" alt="Choix utilisateur" className="w-4 h-4 mr-1" />
                        </div>
                        Choix Utilisateur
                    </Link>              
                </div>



                <div className="justify-center items-center justify-items-center  text-white text-[12px]">
                    
                    <Link className="shadow-md hover:shadow-xl  transition ease-in-out  duration-500  rounded bg-bleuclair py-2 px-4 my-3 w-full flex justify-start items-center justify-items-start "
                    href={`/questionnaire?id_user=${userId}`}>
                        <div className="">
                            <img src="/assets/icons/documentation.svg" alt="Questionnaire" className="w-4 h-4 mr-1" />
                        </div>
                        Remplir Questionnaire
                    </Link>              
                </div>

                <div className="justify-center items-center justify-items-center  text-white text-[12px]">
                    
                    <Link className="shadow-md hover:shadow-xl  transition ease-in-out  duration-500  rounded bg-bleuclair py-2 px-4 my-3 w-full flex justify-start items-center justify-items-start "
                    href={`/associerUser?id_user=${userId}`}>
                        <div className="">
                            <img src="/assets/icons/documentation.svg" alt="Questionnaire" className="w-4 h-4 mr-1" />
                        </div>
                        Associer son empriente
                    </Link>              
                </div>

                <div className="justify-center items-center justify-items-center  text-white text-[12px]">
                    
                    <Link className="shadow-md hover:shadow-xl  transition ease-in-out  duration-500  rounded bg-bleuclair py-2 px-4 my-3 w-full flex justify-start items-center justify-items-start "
                    href={`/qrcode?id_user=${userId}`}>
                        <div className="">
                            <img src="/assets/icons/documentation.svg" alt="Questionnaire" className="w-4 h-4 mr-1" />
                        </div>
                        Générer un QR code
                    </Link>              
                </div>
                

                

            </div>
            
        </div>
            
        
    
    )

}