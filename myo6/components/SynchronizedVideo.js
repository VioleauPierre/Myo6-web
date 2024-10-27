import React, { useEffect, useState, useRef } from 'react';

const VIDEO_CACHE_KEY = 'cached_pupil_video';
const CACHE_DURATION =  15 * 1000; // 24 hours

export default function SynchronizedVideo({ onVideoReady, className }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    async function loadVideo() {
      try {
        // Check local storage first
        const cachedVideo = localStorage.getItem(VIDEO_CACHE_KEY);
        if (cachedVideo) {
          const { videoData, timestamp, contentType } = JSON.parse(cachedVideo);
          
          // Check if cache is still valid
          if (new Date().getTime() - timestamp < CACHE_DURATION) {
            setVideoUrl(`data:${contentType};base64,${videoData}`);
            setLoading(false);
            return;
          }
        }

        // Fetch video from your Flask backend
        const response = await fetch('https://myo6.duckdns.org/api/video/last_video/video_traitement.mp4');
        if (!response.ok) throw new Error('Failed to fetch video');
        
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const base64Video = reader.result.split(',')[1];
          
          // Cache the video
          localStorage.setItem(VIDEO_CACHE_KEY, JSON.stringify({
            videoData: base64Video,
            timestamp: new Date().getTime(),
            contentType: 'video/mp4'
          }));

          setVideoUrl(reader.result);
          setLoading(false);
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error loading video:', error);
        setLoading(false);
      }
    }

    loadVideo();
  }, []);

  useEffect(() => {
    if (!loading && videoRef.current) {
      // Notify parent component when video is ready
      onVideoReady && onVideoReady(true);
      
      // Reset video to start
      videoRef.current.currentTime = 0;
    }
  }, [loading, onVideoReady]);

  if (loading) {
    return (
      <div className={className + " flex justify-center items-center"}>
        <div className="text-lg font-bold text-[#082431]">Chargement de la vidéo...</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <video 
        ref={videoRef}
        autoPlay 
        muted 
        width="auto"
        onEnded={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
          }
        }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
}