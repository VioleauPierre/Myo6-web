import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import { Component } from 'react'
import { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'

export default function VideoUpload() {
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreviewURL, setVideoPreviewURL] = useState(null)
  const [id, setid] = useState('');

  const [submissionMessage, setSubmissionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

    let date = new Date();
    let datevideo = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + 'min' + date.getSeconds() + 'sec';
    let path = 'ID_' + id + '/' + datevideo;


  const handleVideoUpload = (acceptedFiles) => {
    setVideoFile(acceptedFiles[0])
    setVideoPreviewURL(URL.createObjectURL(acceptedFiles[0]))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('file', videoFile)
      formData.append('video_path', path);

      const response = await fetch('https://myo6.duckdns.org/upload/video_web', {
        method: 'POST',
        body: formData,
      })
      setConfirmationMessage('Envoi de la vidéo en cours...')
      setErrorMessage('')
      setSubmissionMessage('')
      if (response.ok) {
        console.log('Vidéo envoyée avec succès')
        setConfirmationMessage('')
        setSubmissionMessage('Vidéo envoyée avec succès');
      } else {
        setConfirmationMessage('')
        setErrorMessage('Erreur lors de l\'envoi de la vidéo')
        console.error('Erreur lors de l\'envoi de la vidéo')
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la vidéo :', error)
    }
  }

  return (
    <>
      <Header></Header>
      <div className="h-screen w-screen">
        <Navbar></Navbar>
        <hr className="w-full h-[4px] bg-beige"></hr>
        <div className="flex min-h-[calc(100%-68px)] bg-gray-300 h-auto">
          <div id="main_code" className="h-full w-full">
            <div className="w-full p-2">
              <div className="flex bg-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-fit">
                <div className="text-xl font-bold text-[#082431]">
                  Upload de Vidéo
                </div>
              </div>
            </div>

            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
            <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2  border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                <p> ID: </p>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setid(e.target.value)}
                    placeholder="Saisissez votre réponse"
                    style={{ width: '190px' }}
                />
            </div>
        </div>


            <div className="w-full sm:w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto">
              <div className="flex bg-white text-center rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                <form onSubmit={handleSubmit}>
                  <Dropzone
                    onDrop={handleVideoUpload}
                    accept="video/*"
                    maxSize={100000000} // Limite la taille du fichier à 100 Mo
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Déposez votre fichier vidéo ici ou cliquez pour sélectionner</p>
                      </div>
                    )}
                  </Dropzone>
                  {videoPreviewURL && (
                    <div>
                      <video controls src={videoPreviewURL} style={{ maxWidth: '100%' }} />
                    </div>
                  )}
                  <div className="flex w-full p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
                    {errorMessage && <div className="bg-red-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{errorMessage}</div>}
                    {submissionMessage && <div className="bg-green-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{submissionMessage}</div>}
                    {confirmationMessage && <div className="bg-green-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{confirmationMessage}</div>}

                  </div>

                  <div className="flex w-1/2 p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
                    <div className="flex bg-sky-600 text-center text-white rounded-lg shadow-xl border-2 mb-2 border-gray-400 p-2 justify-center items-center justify-items-center h-full">
                      <button type="submit">Uploader</button>
                    </div>
                  </div>
                  
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}