
import Head from "next/head";
import { useState } from "react";

import Link from "next/link";
import SideBar from "./SideBar";
import Image from "next/image";

export default function Navbar() {

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
                        <Link href="/dataExports" className="text-white text-xl sm:text-3xl pl-2 sm:pl-5 pr-10 ">Myo6</Link>

                    </div>

                </div>
                <div className="w-1/2">

                <div className="flex justify-end items-center justify-items-center h-full w-full p-2">

                    <Link href="/dataExports" className="text-white text-sm sm:text-xl pr-2 sm:pr-5">
                        Exports CSV
                    </Link>
                    
                    

                </div>

                </div>

            </div>
         
                    
            
        </div>

        </>
        
    
    )

}
