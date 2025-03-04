import Head from "next/head";


import Link from "next/link";
import Image from "next/image";


export default function SideBar({setISideBarOpen}) {
    return (         
        
            
        <div className="fixed top-0 left-0 h-full  bg-gray-900 min-w-[230px] z-10 ">
        

            <div className="p-2 ">

                <button className="text-lg p-1 font-light text-white " onClick={() => setISideBarOpen(false)}>
                    Menu
                </button>

                <div className="justify-center items-center justify-items-center text-white text-[12px]">
                    
                    <Link className=" shadow-md hover:shadow-xl  transition ease-in-out  duration-500 rounded bg-bleuclair py-2 px-4 my-3 w-full flex justify-start items-center justify-items-start "
                     href="/">               
                        <div className="">
                            <img src="/assets/icons/dash.svg" alt="Home" className="w-4 h-4 mr-1" />
                        </div>
                        Accueil
                    </Link>              
                </div>
               
                <div className="justify-center items-center justify-items-center  text-white text-[12px]">
                    
                    <Link className="shadow-md hover:shadow-xl  transition ease-in-out  duration-500  rounded bg-bleuclair py-2 px-4 my-3 w-full flex justify-start items-center justify-items-start "
                    href="choixuser">
                        <div className="">
                            <img src="/assets/icons/documentation.svg" alt="Choix utilisateur" className="w-4 h-4 mr-1" />
                        </div>
                        Mon équipe
                    </Link>              
                </div>
                <div className="justify-center items-center justify-items-center  text-white text-[12px]">
                    
                    <Link className="shadow-md hover:shadow-xl  transition ease-in-out  duration-500  rounded bg-bleuclair py-2 px-4 my-3 w-full flex justify-start items-center justify-items-start "
                    href="directmesure6">
                        <div className="">
                            <img src="/assets/icons/settings.svg" alt="Mesure en direct" className="w-4 h-4 mr-1" />
                        </div>
                        Dernière mesure
                    </Link>              
                </div>
                
                <div className="justify-center items-center justify-items-center  text-white text-[12px]">
                    
                    <Link className="shadow-md hover:shadow-xl  transition ease-in-out  duration-500  rounded bg-bleuclair py-2 px-4 my-3 w-full flex justify-start items-center justify-items-start "
                    href="createUser">
                        <div className="">
                            <img src="/assets/icons/documentation.svg" alt="Créer utilisateur" className="w-4 h-4 mr-1" />
                        </div>
                        Ajouter un Utilisateur
                    </Link>              
                </div>



                {/* <div className="justify-center items-center justify-items-center  text-white text-[12px]">
                    
                    <Link className="shadow-md hover:shadow-xl  transition ease-in-out  duration-500  rounded bg-bleuclair py-2 px-4 my-3 w-full flex justify-start items-center justify-items-start "
                    href="questionnaire">
                        <div className="">
                            <img src="/assets/icons/documentation.svg" alt="Questionnaire" className="w-4 h-4 mr-1" />
                        </div>
                        Remplir Questionnaire
                    </Link>              
                </div>*/}

                <div className="justify-center items-center justify-items-center  text-white text-[12px]">
                    
                    <Link className="shadow-md hover:shadow-xl  transition ease-in-out  duration-500  rounded bg-bleuclair py-2 px-4 my-3 w-full flex justify-start items-center justify-items-start "
                    href="accessData">
                        <div className="">
                            <img src="/assets/icons/documentation.svg" alt="Accès Data" className="w-4 h-4 mr-1" />
                        </div>
                        Accès Data
                    </Link>              
                </div>

                <div className="justify-center items-center justify-items-center  text-white text-[12px]">
                    
                    <Link className="shadow-md hover:shadow-xl  transition ease-in-out  duration-500  rounded bg-bleuclair py-2 px-4 my-3 w-full flex justify-start items-center justify-items-start "
                    href="addFingerprint">
                        <div className="">
                            <img src="/assets/icons/documentation.svg" alt="Accès Data" className="w-4 h-4 mr-1" />
                        </div>
                        Enregistrement empreinte
                    </Link>              
                </div>

                <div className="justify-center items-center justify-items-center  text-white text-[12px]">
                    
                    <Link className="shadow-md hover:shadow-xl  transition ease-in-out  duration-500  rounded bg-bleuclair py-2 px-4 my-3 w-full flex justify-start items-center justify-items-start "
                    href="qrcode">
                        <div className="">
                            <img src="/assets/icons/documentation.svg" alt="Générer QR code" className="w-4 h-4 mr-1" />
                        </div>
                        Générer un QR code
                    </Link>              
                </div> 

                

            </div>
            
        </div>
            
        
    
    )

}