
import Head from "next/head";
import SideBar from "./SideBar";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from 'react'
import { useState } from 'react'

export default function Navbar() {
    const [userId, setUserId] = useState([]);

    useEffect(() => {
        if (window.location.href.split("=")[1] == undefined) {
        } else {
          setUserId(window.location.href.split("=")[1])
        }
      }, []);

    const [isSideBarOpen, setISideBarOpen] = useState(false);

    return (
        
        <>
        {
            isSideBarOpen && <SideBar setISideBarOpen={setISideBarOpen} />
        }

        <div className="w-full flex">
            
            
            <div className="flex  w-full shadow-md h-16  bg-bleugris">
                
                <div className="w-1/2  ">

                    <div className="flex justify-start items-center justify-items-center h-full w-full p-2">

                        <button className="" onClick={() => setISideBarOpen(!isSideBarOpen)}>
                            ||||
                        </button>

                        <img src="/assets/images/logo.png" alt="Logo" className="h-full w-auto rounded-md ml-2 sm:ml-5" />
                        {/* <h1 className="text-4xl text-white pl-5">Myo6</h1> */}
                        <Link href="/" className="text-white text-xl sm:text-3xl pl-2 sm:pl-5 pr-10 ">Myo6</Link>

                    </div>

                </div>
                <div className="w-1/2">

                <div className="flex justify-end items-center justify-items-center h-full w-full p-2">

                    <Link href={`/Help?id_user=${userId}`} className="text-white text-sm sm:text-xl pr-2  sm:pr-5">Help</Link>

                    <Link href={`/About?id_user=${userId}`} className="text-white text-sm sm:text-xl pr-2 sm:pr-5">A propos</Link>

                    <Link href={`/Login?id_user=${userId}`} className="h-full">

                        <img src="/assets/icons/user.svg" alt="Logo" className="h-full rounded-md mr-1 sm:mr-5" />

                    </Link>
                    
                    

                </div>

                </div>

            </div>
         
                    
            
        </div>

        </>
        
    
    )

}