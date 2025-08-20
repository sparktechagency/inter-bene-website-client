"use client";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  url: string;
}

const CustomVideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      } else {
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(false);
      setHasEnded(true);
      // Don't auto-reset anymore, let user click replay
    };

    // Fallback to check duration if loadedmetadata doesn't fire
    const checkDuration = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      } else {
        setTimeout(checkDuration, 500); // Retry after 500ms
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setError("Failed to load video");
    };

    // Disable context menu (three-dot menu)
    video.addEventListener("contextmenu", (e) => e.preventDefault());
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    // Trigger fallback check
    setTimeout(checkDuration, 100);

    // Sometimes, the metadata might already be loaded before the event listener is added
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      video.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (hasEnded) {
        // Reset video when replaying
        videoRef.current.currentTime = 0;
        setProgress(0);
        setCurrentTime(0);
        setHasEnded(false);
      }
      
      if (isPlaying) {
        videoRef.current.pause();
        setShowControls(false);
      } else {
        videoRef.current.play();
        setShowControls(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="relative max-w-4xl mx-auto group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={url}
        className="w-full h-[500px] rounded-xl"
        onClick={togglePlay}
        controls={false} // Disable default controls
        controlsList="nodownload" // Disable download option
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-white text-xs whitespace-nowrap">
              Loading...
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center text-white">
            <div className="text-2xl mb-2">⚠️</div>
            <p className="text-sm mb-3">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors cursor-pointer flex items-center gap-2 mx-auto"
            >
              <RotateCcw size={16} />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Centered Play/Replay Icon */}
      {!isPlaying && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="text-white size-16 flex justify-center cursor-pointer items-center opacity-80 hover:opacity-100 transition-opacity duration-300 bg-gray-900/50 rounded-full"
          >
            {hasEnded ? (
              <RotateCcw size={34} strokeWidth={1.5} />
            ) : (
              <Play size={34} strokeWidth={1.5} />
            )}
          </button>
        </div>
      )}

      {/* Custom Controls (Visible when playing or on hover) */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t rounded-xl from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"
          }`}
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="w-full h-1 bg-gray-400 rounded-full mb-4 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-primary transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-primary transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 accent-primary" // Change range color
              />
            </div>

            {/* Time Display */}
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-primary transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
