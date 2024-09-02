import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Link from "next/link";
import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage(props) {
  let baseUrl = "s";
  if (props.DEBUG_MODE === 'true') {
    baseUrl = "http://localhost:3000/";
    console.log("DEBUG_MODE");
  } else {
    baseUrl = "https://myo6-web.vercel.app/";
    console.log(baseUrl);
  }

  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage('Veuillez remplir tous les champs');
      return;
    }

    setErrorMessage('');

    try {
      const response = await fetch('https://myo6.duckdns.org/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        router.push(`/coachPage?id_user=${data.id_user}`); // Redirigez l'utilisateur vers la page protégée
      } else {
        setErrorMessage('Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Une erreur s\'est produite lors de la connexion');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Header></Header>
      <div className="h-screen w-screen">
        <Navbar></Navbar>
        <hr className="w-full h-[4px] bg-beige"></hr>
        <div className='flex min-h-[calc(100%-68px)] bg-gray-300 h-auto'>
          <div id="main_code" className="h-full w-full">
            <div className="w-full p-2">
              <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-fit">
                <div className="text-xl font-bold text-[#082431]">
                  Connexion
                </div>
              </div>
            </div>

            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                <p>Email :</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Saisissez votre email"
                  style={{ width: '190px' }}
                />
              </div>
            </div>

            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                <p>Mot de passe :</p>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Saisissez votre mot de passe"
                  style={{ width: '190px' }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="ml-2"
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            <div className="flex w-full p-2 justify-center items-center justify-items-center ml-auto mr-auto">
              {errorMessage && <div className="bg-red-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{errorMessage}</div>}
            </div>

            <div className="flex w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto">
              <div className="flex bg-sky-600 text-center text-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                <button onClick={handleSubmit}>Se connecter</button>
              </div>
            </div>

            <div className="flex w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto">
              <div className="flex bg-sky-600 text-center text-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                <Link href="/createUser">
                  <button>Créer un compte</button>
                </Link>
              </div>
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
