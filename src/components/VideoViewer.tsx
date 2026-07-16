import { useState, useEffect, useRef, useCallback, useMemo } from "react";

type VideoViewerProps = {
  title?: string;
  videoUrl: string;
  pdfUrl: string;
  imageUrl?: string;
  textColor?: string;
  showBorder?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  index?: number;
};

function VideoViewer({ 
  title, 
  videoUrl, 
  pdfUrl, 
  imageUrl = "", 
  textColor = "black", 
  showBorder = true,
  autoPlay = true,
  muted = true,
  index
}: VideoViewerProps) {
  // ========== 状态管理 ==========
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);

  // ========== Refs ==========
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const pdfIframeRef = useRef<HTMLIFrameElement>(null);
  const isMountedRef = useRef(true);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ========== 计算属性 ==========
  const displayTitle = useMemo(() => {
    if (title) return title;
    if (index !== undefined && index >= 0) {
      return `编号 ${String(index + 1).padStart(3, '0')}`;
    }
    return '未命名文档';
  }, [title, index]);

  const videoPath = useMemo(() => {
    if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
      return videoUrl;
    }
    let path = videoUrl.startsWith('/') ? videoUrl : `/${videoUrl}`;
    try {
      const parts = path.split('/');
      const encodedParts = parts.map(part => {
        if (/[\u4e00-\u9fa5]/.test(part)) {
          return encodeURIComponent(part);
        }
        return part;
      });
      path = encodedParts.join('/');
    } catch (e) {
      console.warn('路径编码失败:', e);
    }
    return path;
  }, [videoUrl]);

  const imagePath = useMemo(() => {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    let path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    try {
      const parts = path.split('/');
      const encodedParts = parts.map(part => {
        if (/[\u4e00-\u9fa5]/.test(part)) {
          return encodeURIComponent(part);
        }
        return part;
      });
      path = encodedParts.join('/');
    } catch (e) {
      console.warn('路径编码失败:', e);
    }
    return path;
  }, [imageUrl]);

  const pdfPath = useMemo(() => {
    if (!pdfUrl) return '';
    if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
      return pdfUrl;
    }
    return pdfUrl.startsWith('/') ? pdfUrl : `/${pdfUrl}`;
  }, [pdfUrl]);

  // ========== 组件挂载/卸载 ==========
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  // ========== ESC 键处理 ==========
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) handleCloseFullscreen();
        if (isPdfViewerOpen) handleClosePdfViewer();
        if (isImageViewerOpen) handleCloseImageViewer();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFullscreen, isPdfViewerOpen, isImageViewerOpen]);

  // ========== 页面滚动控制 ==========
  useEffect(() => {
    document.body.style.overflow = (isPdfViewerOpen || isFullscreen || isImageViewerOpen) ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPdfViewerOpen, isFullscreen, isImageViewerOpen]);

  // ========== 全屏重置 ==========
  useEffect(() => {
    if (!isFullscreen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isFullscreen]);

  // ========== 缓冲检测 ==========
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => {
      setIsBuffering(false);
      setIsLoading(false);
    };
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsLoading(false);
    };

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
    };
  }, []);

  // ========== 视频重试 ==========
  const handleRetryLoad = useCallback(() => {
    if (retryCount >= 3) {
      setVideoError(true);
      return;
    }
    setRetryCount(prev => prev + 1);
    setVideoError(false);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [retryCount]);

  // ========== 自动播放 ==========
  useEffect(() => {
    if (autoPlay && videoRef.current && !hasUserInteracted) {
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {
                setIsPlaying(false);
                setIsLoading(false);
              });
            }
          });
      }
    }
  }, [autoPlay, hasUserInteracted]);

  // ========== 同步播放状态 ==========
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
          handleRetryLoad();
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, handleRetryLoad]);

  // ========== 同步音量 ==========
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // ========== 事件处理函数 ==========
  const handleVideoError = useCallback(() => {
    if (retryCount < 3) {
      handleRetryLoad();
    } else {
      setVideoError(true);
      setIsLoading(false);
    }
  }, [retryCount, handleRetryLoad]);

  const handleVideoLoadStart = useCallback(() => {
    setIsLoading(true);
    setVideoError(false);
  }, []);

  const handleVideoCanPlay = useCallback(() => {
    setIsLoading(false);
    setIsBuffering(false);
    setVideoError(false);
  }, []);

  const handleVideoWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handlePlayPause = useCallback(() => {
    setHasUserInteracted(true);
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleVideoClick = useCallback(() => {
    setHasUserInteracted(true);
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
    setIsLoading(false);
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHasUserInteracted(true);
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHasUserInteracted(true);
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    setHasUserInteracted(true);
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (!newMuted && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  }, [volume]);

  const formatTime = useCallback((time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // ========== 全屏控制 ==========
  const handleOpenFullscreen = useCallback(() => {
    setIsFullscreen(true);
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    if (videoRef.current && isPlaying) {
      setTimeout(() => {
        if (fullscreenVideoRef.current) {
          fullscreenVideoRef.current.currentTime = videoRef.current?.currentTime || 0;
          fullscreenVideoRef.current.muted = isMuted;
          fullscreenVideoRef.current.play().catch(() => {});
        }
      }, 100);
    }
  }, [isPlaying, isMuted]);

  const handleCloseFullscreen = useCallback(() => {
    setIsFullscreen(false);
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(() => {});
    }
  }, [isPlaying]);

  const handleToggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      handleCloseFullscreen();
    } else {
      handleOpenFullscreen();
    }
  }, [isFullscreen, handleOpenFullscreen, handleCloseFullscreen]);

  // ========== PDF 控制 ==========
  const handleViewPDF = useCallback(() => {
    setPdfLoading(true);
    setPdfError(false);
    setIsPdfViewerOpen(true);
  }, []);

  const handleClosePdfViewer = useCallback(() => {
    setIsPdfViewerOpen(false);
    setPdfLoading(false);
    setPdfError(false);
  }, []);

  const handlePdfViewerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClosePdfViewer();
    }
  }, [handleClosePdfViewer]);

  const handlePdfLoad = useCallback(() => {
    setPdfLoading(false);
    setPdfError(false);
  }, []);

  const handlePdfError = useCallback(() => {
    setPdfLoading(false);
    setPdfError(true);
  }, []);

  // ========== 图片控制 ==========
  const handleViewImage = useCallback(() => {
    setIsImageViewerOpen(true);
  }, []);

  const handleCloseImageViewer = useCallback(() => {
    setIsImageViewerOpen(false);
  }, []);

  const handleImageViewerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseImageViewer();
    }
  }, [handleCloseImageViewer]);

  // ========== 缩放控制 ==========
  const handleReset = useCallback(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleRotate = useCallback((degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 5));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [scale, position.x, position.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, scale, dragStart.x, dragStart.y]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  }, [scale, position.x, position.y]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging && scale > 1 && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  }, [isDragging, scale, dragStart.x, dragStart.y]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <>
      {/* 全局样式 */}
      <style>{`
        img, video {
          max-width: 100%;
        }
        video::-webkit-media-controls-picture-in-picture-button {
          display: none;
        }
        .pdf-viewer-container {
          position: relative;
        }
        .pdf-loading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        .pdf-loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(59,130,246,0.2);
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .pdf-loading-text {
          margin-top: 12px;
          color: #4b5563;
          font-size: 14px;
        }
        .pdf-error-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          padding: 20px;
        }
        .pdf-error-icon { font-size: 48px; margin-bottom: 12px; }
        .pdf-error-title { font-size: 18px; font-weight: 600; color: #dc2626; margin-bottom: 8px; }
        .pdf-error-desc { font-size: 14px; color: #6b7280; text-align: center; max-width: 400px; margin-bottom: 16px; }
        .pdf-retry-btn {
          padding: 8px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }
        .pdf-retry-btn:hover { background: #2563eb; }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .video-loading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          border-radius: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          backdrop-filter: blur(4px);
        }
        .video-loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .video-loading-text {
          color: white;
          margin-top: 12px;
          font-size: 14px;
          font-weight: 500;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }
        .video-buffering-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9;
          background: rgba(0,0,0,0.6);
          border-radius: 50%;
          padding: 12px;
        }
        .video-buffering-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
      `}</style>

      {/* 主容器 */}
      <div
        className={`
          ${showBorder ? 'border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300' : ''}
          bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-gray-700/50 dark:to-gray-600/50
          backdrop-blur-sm
          p-6 md:p-8 lg:p-10
          mx-4 md:mx-8 lg:mx-12
          my-4
        `}
      >
        {/* 标题 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2 sm:gap-4">
          <div className={`text-3xl md:text-5xl font-black text-${textColor} flex-shrink-0`}>
            {displayTitle}
          </div>
          <div className="text-sm md:text-base text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-700/50 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 flex-shrink-0">
            🎬 点击视频切换播放/暂停&nbsp;&nbsp;
            <span className="text-red-600 dark:text-red-400">默认是静音播放</span>
            {isLoading && (
              <span className="ml-2 text-yellow-500 dark:text-yellow-400">⏳ 加载中...</span>
            )}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 图片区域 */}
          <div className="flex-1 flex justify-center items-start">
            <div className="relative w-full max-w-[600px] lg:max-w-[700px]">
              {imageUrl && !imageError ? (
                <img
                  src={imagePath}
                  alt={displayTitle}
                  className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={handleViewImage}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-500">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>图片预留位置</p>
                    <p className="text-sm mt-1">请添加图片URL</p>
                  </div>
                </div>
              )}
              {imageUrl && !imageError && (
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  🖼️ 点击查看
                </div>
              )}
            </div>
          </div>

          {/* 视频区域 */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="relative w-full max-w-[600px] lg:max-w-[700px]">
              {/* 加载状态 */}
              {isLoading && !videoError && (
                <div className="video-loading-overlay">
                  <div className="video-loading-spinner" />
                  <div className="video-loading-text">加载中...</div>
                </div>
              )}

              {/* 缓冲指示器 */}
              {isBuffering && !isLoading && !videoError && isPlaying && (
                <div className="video-buffering-indicator">
                  <div className="video-buffering-spinner" />
                </div>
              )}

              {videoError ? (
                <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>视频加载失败</p>
                    <p className="text-sm mt-1">请检查视频文件路径</p>
                    <button
                      onClick={() => {
                        setVideoError(false);
                        setIsLoading(true);
                        setRetryCount(0);
                        if (videoRef.current) {
                          videoRef.current.load();
                        }
                      }}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      🔄 重新加载
                    </button>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={videoPath}
                  className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={handleVideoClick}
                  onError={handleVideoError}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onLoadStart={handleVideoLoadStart}
                  onCanPlay={handleVideoCanPlay}
                  onWaiting={handleVideoWaiting}
                  playsInline
                  muted={isMuted}
                  loop
                  autoPlay={autoPlay}
                />
              )}

              {/* 视频控制栏 */}
              {!videoError && (
                <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPause();
                    }}
                    className="text-white hover:text-gray-300 transition-colors p-1 flex-shrink-0"
                  >
                    {isPlaying ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>

                  <span className="text-white text-xs min-w-[60px] flex-shrink-0">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer min-w-[40px]"
                    style={{
                      background: `linear-gradient(to right, white 0%, white ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) 100%)`
                    }}
                  />

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMute();
                      }}
                      className="text-white hover:text-gray-300 transition-colors p-1"
                    >
                      {isMuted || volume === 0 ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                      )}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-12 md:w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* 状态指示器 */}
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                {isLoading ? '⏳ 加载中...' : 
                 isBuffering ? '⏳ 缓冲中...' :
                 isPlaying ? '▶ 播放中' : '⏸ 已暂停'}
              </div>
            </div>

            {/* PC端按钮 */}
            <div className="hidden lg:flex flex-wrap items-center justify-center gap-3 mt-4 w-full max-w-[600px] lg:max-w-[700px]">
              {imageUrl && !imageError && (
                <button
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-purple-500/50 bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/30 rounded-md hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-200/50 transition-all duration-200 text-sm md:text-base lg:text-lg whitespace-nowrap text-purple-700 dark:text-purple-300 shadow-sm hover:shadow"
                  onClick={handleViewImage}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>查看图片</span>
                </button>
              )}
              
              <button
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-blue-500/50 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/30 rounded-md hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200/50 transition-all duration-200 text-sm md:text-base lg:text-lg whitespace-nowrap text-blue-700 dark:text-blue-300 shadow-sm hover:shadow"
                onClick={handleViewPDF}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>查看PDF</span>
              </button>
              
              <button
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-green-500/50 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/30 rounded-md hover:bg-gradient-to-r hover:from-green-100 hover:to-green-200/50 transition-all duration-200 text-sm md:text-base lg:text-lg whitespace-nowrap text-green-700 dark:text-green-300 shadow-sm hover:shadow"
                onClick={handleToggleFullscreen}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                <span>{isFullscreen ? "退出全屏" : "全屏看视频"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 移动端按钮 */}
        <div className="flex lg:hidden flex-col items-center gap-3 mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            className="inline-flex items-center justify-center gap-2 px-6 py-3 w-full max-w-[280px] border border-green-500/50 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/30 rounded-md hover:bg-gradient-to-r hover:from-green-100 hover:to-green-200/50 transition-all duration-200 text-base whitespace-nowrap text-green-700 dark:text-green-300 shadow-sm hover:shadow"
            onClick={handleToggleFullscreen}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
            <span>{isFullscreen ? "退出全屏" : "全屏看视频"}</span>
          </button>
          
          <button
            className="inline-flex items-center justify-center gap-2 px-6 py-3 w-full max-w-[280px] border border-blue-500/50 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/30 rounded-md hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200/50 transition-all duration-200 text-base whitespace-nowrap text-blue-700 dark:text-blue-300 shadow-sm hover:shadow"
            onClick={handleViewPDF}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>查看PDF</span>
          </button>
          
          {imageUrl && !imageError && (
            <button
              className="inline-flex items-center justify-center gap-2 px-6 py-3 w-full max-w-[280px] border border-purple-500/50 bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/30 rounded-md hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-200/50 transition-all duration-200 text-base whitespace-nowrap text-purple-700 dark:text-purple-300 shadow-sm hover:shadow"
              onClick={handleViewImage}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>查看图片</span>
            </button>
          )}
        </div>
      </div>

      {/* PDF查看器 */}
      {isPdfViewerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={handlePdfViewerClick}
        >
          <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden pdf-viewer-container">
            <button
              className="absolute top-4 right-4 z-10 text-gray-700 text-4xl hover:text-gray-900 transition-colors bg-white/90 rounded-full w-12 h-12 flex items-center justify-center hover:bg-white shadow-lg"
              onClick={handleClosePdfViewer}
            >
              ✕
            </button>

            <div className="absolute top-4 left-4 z-10">
              <h3 className="text-xl font-semibold text-gray-800 bg-white/90 px-4 py-2 rounded-lg shadow-lg">
                📄 {displayTitle}
              </h3>
            </div>

            {pdfLoading && (
              <div className="pdf-loading-overlay">
                <div className="pdf-loading-spinner" />
                <div className="pdf-loading-text">正在加载 PDF...</div>
              </div>
            )}

            {pdfError && (
              <div className="pdf-error-overlay">
                <div className="pdf-error-icon">📄</div>
                <div className="pdf-error-title">PDF 加载失败</div>
                <div className="pdf-error-desc">
                  无法加载此 PDF 文件。请检查文件路径或网络连接。
                </div>
                <button
                  className="pdf-retry-btn"
                  onClick={() => {
                    setPdfError(false);
                    setPdfLoading(true);
                    if (pdfIframeRef.current) {
                      pdfIframeRef.current.src = pdfPath;
                    }
                  }}
                >
                  🔄 重新加载
                </button>
              </div>
            )}

            <iframe
              ref={pdfIframeRef}
              src={pdfPath}
              className="w-full h-full"
              title={displayTitle}
              style={{ border: 'none' }}
              onLoad={handlePdfLoad}
              onError={handlePdfError}
            />
          </div>
        </div>
      )}

      {/* 图片查看器 */}
      {isImageViewerOpen && imageUrl && !imageError && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={handleImageViewerClick}
        >
          <div className="relative w-[90vw] h-[90vh] flex items-center justify-center">
            <button
              className="absolute top-4 right-4 z-10 text-white text-4xl hover:text-gray-300 transition-colors bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70"
              onClick={handleCloseImageViewer}
            >
              ✕
            </button>

            <div className="absolute top-4 left-4 z-10">
              <h3 className="text-xl font-semibold text-white bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                🖼️ {displayTitle}
              </h3>
            </div>

            <img
              src={imagePath}
              alt={displayTitle}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      )}

      {/* 全屏遮罩层 */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={handleCloseFullscreen}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden">
            <div 
              className="relative"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease'
              }}
            >
              {!videoError ? (
                <video
                  ref={fullscreenVideoRef}
                  src={videoPath}
                  className="max-w-[95vw] max-h-[85vh] object-contain select-none"
                  onError={handleVideoError}
                  controls
                  autoPlay={isPlaying}
                  playsInline
                  muted={isMuted}
                  loop
                />
              ) : (
                <div className="max-w-[95vw] max-h-[85vh] bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>视频加载失败</p>
                  </div>
                </div>
              )}
            </div>

            {/* 顶部控制栏 */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="text-white text-lg font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                {displayTitle}
              </div>
              <button
                className="text-white text-4xl hover:text-gray-300 transition-colors bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseFullscreen();
                }}
              >
                ✕
              </button>
            </div>

            {/* 底部控制按钮 */}
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
              <button
                className="text-white hover:text-gray-300 transition-colors text-sm px-3 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setScale(prev => Math.min(prev + 0.2, 5));
                }}
                title="放大"
              >
                ➕
              </button>
              <span className="text-white text-sm min-w-[40px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                className="text-white hover:text-gray-300 transition-colors text-sm px-3 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setScale(prev => Math.max(prev - 0.2, 0.5));
                }}
                title="缩小"
              >
                ➖
              </button>
              <span className="text-white/30">|</span>
              <button
                className="text-white hover:text-gray-300 transition-colors text-sm px-3 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRotate(-90);
                }}
                title="逆时针旋转90°"
              >
                ↺
              </button>
              <span className="text-white text-sm min-w-[40px] text-center">
                {rotation}°
              </span>
              <button
                className="text-white hover:text-gray-300 transition-colors text-sm px-3 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRotate(90);
                }}
                title="顺时针旋转90°"
              >
                ↻
              </button>
              <span className="text-white/30">|</span>
              <button
                className="text-white hover:text-gray-300 transition-colors text-sm px-3 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                title="重置"
              >
                ⟲
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VideoViewer;