import React, { useState } from 'react';

const VideoUploader = () => {
  const [video, setVideo] = useState(null);

  const [submissionMessage, setSubmissionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

    let date = new Date();
    let datevideo = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + 'min' + date.getSeconds() + 'sec';
    let path = 'ID_' + 19 + '/' + datevideo;

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'video/quicktime') {
      setVideo(file);
    } else {
      alert('Veuillez sélectionner un fichier vidéo .mov');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData()
      formData.append('file', video)
      formData.append('video_path', path);

      const response = await fetch('https://myo6-web.duckdns.org/upload/video_web', {
        method: 'POST',
        body: formData,
      })
      setErrorMessage('')
      setSubmissionMessage('')
      if (response.ok) {
        console.log('Vidéo envoyée avec succès')
        setSubmissionMessage('Vidéo envoyée avec succès');
      } else {
        setErrorMessage('Erreur lors de l\'envoi de la vidéo')
        console.error('Erreur lors de l\'envoi de la vidéo')
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la vidéo :', error)
    }    console.log('Vidéo uploadée :', video);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="video/quicktime"
        onChange={handleVideoUpload}
      />
      <button type="submit" disabled={!video}>
        Uploader la vidéo
      </button>
                  <div className="flex w-full p-2 justify-center items-center justify-items-center ml-auto mr-auto ">
                    {errorMessage && <div className="bg-red-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{errorMessage}</div>}
                    {submissionMessage && <div className="bg-green-500 text-white rounded-lg shadow-xl border-2 border-gray-400 p-2">{submissionMessage}</div>}
                  </div>
    </form>
  );
};

export default VideoUploader;