import { useState, useEffect, useRef } from "react";

type VideoViewerProps = {
  title: string;
  videoUrl: string;
  pdfUrl: string;
  imageUrl?: string;
  textColor?: string;
  showBorder?: boolean;
  autoPlay?: boolean;
};

function VideoViewer({ 
  title, 
  videoUrl, 
  pdfUrl, 
  imageUrl = "", 
  textColor = "black", 
  showBorder = true,
  autoPlay = true
}: VideoViewerProps) {
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
  const [isMuted, setIsMuted] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

  // 处理 ESC 键退出全屏或PDF查看器
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          handleCloseFullscreen();
        }
        if (isPdfViewerOpen) {
          handleClosePdfViewer();
        }
        if (isImageViewerOpen) {
          handleCloseImageViewer();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFullscreen, isPdfViewerOpen, isImageViewerOpen]);

  // 重置缩放、旋转和位置
  useEffect(() => {
    if (!isFullscreen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isFullscreen]);

  // 当PDF查看器打开时，禁止页面滚动
  useEffect(() => {
    if (isPdfViewerOpen || isFullscreen || isImageViewerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPdfViewerOpen, isFullscreen, isImageViewerOpen]);

  // 自动播放视频（页面加载时）
  useEffect(() => {
    if (autoPlay && videoRef.current && !hasUserInteracted) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlay, hasUserInteracted]);

  // 同步视频播放状态
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // 同步音量
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleViewPDF = () => {
    setIsPdfViewerOpen(true);
  };

  const handleClosePdfViewer = () => {
    setIsPdfViewerOpen(false);
  };

  const handlePdfViewerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClosePdfViewer();
    }
  };

  const handleViewImage = () => {
    setIsImageViewerOpen(true);
  };

  const handleCloseImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  const handleImageViewerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseImageViewer();
    }
  };

  const handleOpenFullscreen = () => {
    setIsFullscreen(true);
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    if (videoRef.current && isPlaying) {
      setTimeout(() => {
        if (fullscreenVideoRef.current) {
          fullscreenVideoRef.current.currentTime = videoRef.current?.currentTime || 0;
          fullscreenVideoRef.current.play().catch(() => {});
        }
      }, 100);
    }
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleToggleFullscreen = () => {
    if (isFullscreen) {
      handleCloseFullscreen();
    } else {
      handleOpenFullscreen();
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // 路径处理函数 - 支持中文文件名
  const getVideoPath = (url: string) => {
    // 如果是完整 URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // 确保路径以 / 开头
    let path = url.startsWith('/') ? url : `/${url}`;
    
    // 对路径进行 URL 编码（处理中文）
    try {
      const parts = path.split('/');
      const encodedParts = parts.map(part => {
        // 如果包含中文，进行编码
        if (/[\u4e00-\u9fa5]/.test(part)) {
          return encodeURIComponent(part);
        }
        return part;
      });
      path = encodedParts.join('/');
    } catch (e) {
      console.warn('路径编码失败，使用原始路径:', e);
    }
    
    return path;
  };

  const getImagePath = (url: string) => {
    // 如果是完整 URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // 确保路径以 / 开头
    let path = url.startsWith('/') ? url : `/${url}`;
    
    // 对路径进行 URL 编码（处理中文）
    try {
      const parts = path.split('/');
      const encodedParts = parts.map(part => {
        // 如果包含中文，进行编码
        if (/[\u4e00-\u9fa5]/.test(part)) {
          return encodeURIComponent(part);
        }
        return part;
      });
      path = encodedParts.join('/');
    } catch (e) {
      console.warn('路径编码失败，使用原始路径:', e);
    }
    
    return path;
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotate = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

  const handlePlayPause = () => {
    setHasUserInteracted(true);
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasUserInteracted(true);
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    setHasUserInteracted(true);
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasUserInteracted(true);
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVideoClick = () => {
    setHasUserInteracted(true);
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(0.5, scale + delta), 5);
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging && scale > 1 && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <>
      {/* 带边框的卡片容器 - 使用渐变色背景 */}
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
        {/* 标题区域 - 标题和描述在同一行 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2 sm:gap-4">
          <div className={`text-3xl md:text-5xl font-black text-${textColor} flex-shrink-0`}>
            {title}
          </div>
          <div className="text-sm md:text-base text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-700/50 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 flex-shrink-0">
            🎬 点击视频切换播放/暂停
          </div>
        </div>

        {/* 内容区域 - 图片在左，视频在右 */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 图片区域 - 左边 */}
          <div className="flex-1 flex justify-center items-start">
            <div className="relative w-full max-w-[600px] lg:max-w-[700px]">
              {imageUrl && !imageError ? (
                <img
                  src={getImagePath(imageUrl)}
                  alt={title}
                  className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={handleViewImage}
                  onError={handleImageError}
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

          {/* 视频区域 - 右边 */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="relative w-full max-w-[600px] lg:max-w-[700px]">
              {videoError ? (
                <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>视频加载失败</p>
                    <p className="text-sm mt-1">请检查视频文件路径</p>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={getVideoPath(videoUrl)}
                  className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={handleVideoClick}
                  onError={handleVideoError}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  playsInline
                  muted={isMuted}
                  loop
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
                    className="text-white hover:text-gray-300 transition-colors p-1"
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
                  
                  <span className="text-white text-xs min-w-[60px]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, white 0%, white ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) 100%)`
                    }}
                  />
                  
                  <div className="flex items-center gap-1">
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
                      className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
              
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                {isPlaying ? '▶ 播放中' : '⏸ 已暂停'}
              </div>
            </div>

            {/* PC端和iPad端按钮 - 放在视频下方，在移动端隐藏 */}
            <div className="hidden lg:flex flex-wrap items-center justify-center gap-3 mt-4 w-full max-w-[600px] lg:max-w-[700px]">
              <button
                className="
                  inline-flex items-center justify-center gap-2
                  px-5 py-2.5
                  border border-green-500/50
                  bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/30
                  rounded-md
                  hover:bg-gradient-to-r hover:from-green-100 hover:to-green-200/50 dark:hover:from-green-800/50 dark:hover:to-green-700/50
                  transition-all duration-200
                  text-sm md:text-base lg:text-lg
                  whitespace-nowrap
                  text-green-700 dark:text-green-300
                  shadow-sm hover:shadow
                "
                onClick={handleToggleFullscreen}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                <span>{isFullscreen ? "退出全屏" : "全屏看视频"}</span>
              </button>
              
              <button
                className="
                  inline-flex items-center justify-center gap-2
                  px-5 py-2.5
                  border border-blue-500/50
                  bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/30
                  rounded-md
                  hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200/50 dark:hover:from-blue-800/50 dark:hover:to-blue-700/50
                  transition-all duration-200
                  text-sm md:text-base lg:text-lg
                  whitespace-nowrap
                  text-blue-700 dark:text-blue-300
                  shadow-sm hover:shadow
                "
                onClick={handleViewPDF}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>查看PDF</span>
              </button>
              
              {imageUrl && !imageError && (
                <button
                  className="
                    inline-flex items-center justify-center gap-2
                    px-5 py-2.5
                    border border-purple-500/50
                    bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/30
                    rounded-md
                    hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-200/50 dark:hover:from-purple-800/50 dark:hover:to-purple-700/50
                    transition-all duration-200
                    text-sm md:text-base lg:text-lg
                    whitespace-nowrap
                    text-purple-700 dark:text-purple-300
                    shadow-sm hover:shadow
                  "
                  onClick={handleViewImage}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>查看图片</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 移动端按钮 - 在lg屏幕以下显示在底部，宽度统一 */}
        <div className="flex lg:hidden flex-col items-center gap-3 mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            className="
              inline-flex items-center justify-center gap-2
              px-6 py-3
              w-full max-w-[280px]
              border border-green-500/50
              bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/30
              rounded-md
              hover:bg-gradient-to-r hover:from-green-100 hover:to-green-200/50 dark:hover:from-green-800/50 dark:hover:to-green-700/50
              transition-all duration-200
              text-base
              whitespace-nowrap
              text-green-700 dark:text-green-300
              shadow-sm hover:shadow
            "
            onClick={handleToggleFullscreen}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
            <span>{isFullscreen ? "退出全屏" : "全屏看视频"}</span>
          </button>
          
          <button
            className="
              inline-flex items-center justify-center gap-2
              px-6 py-3
              w-full max-w-[280px]
              border border-blue-500/50
              bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/30
              rounded-md
              hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200/50 dark:hover:from-blue-800/50 dark:hover:to-blue-700/50
              transition-all duration-200
              text-base
              whitespace-nowrap
              text-blue-700 dark:text-blue-300
              shadow-sm hover:shadow
            "
            onClick={handleViewPDF}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>查看PDF</span>
          </button>
          
          {imageUrl && !imageError && (
            <button
              className="
                inline-flex items-center justify-center gap-2
                px-6 py-3
                w-full max-w-[280px]
                border border-purple-500/50
                bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/30
                rounded-md
                hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-200/50 dark:hover:from-purple-800/50 dark:hover:to-purple-700/50
                transition-all duration-200
                text-base
                whitespace-nowrap
                text-purple-700 dark:text-purple-300
                shadow-sm hover:shadow
              "
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

      {/* PDF查看器遮罩层 */}
      {isPdfViewerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fadeIn"
          onClick={handlePdfViewerClick}
        >
          <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden">
            <button
              className="
                absolute top-4 right-4 z-10
                text-gray-700 text-4xl
                hover:text-gray-900
                transition-colors duration-200
                bg-white/90
                rounded-full w-12 h-12
                flex items-center justify-center
                hover:bg-white
                shadow-lg
              "
              onClick={handleClosePdfViewer}
            >
              ✕
            </button>

            <div className="absolute top-4 left-4 z-10">
              <h3 className="text-xl font-semibold text-gray-800 bg-white/90 px-4 py-2 rounded-lg shadow-lg">
                📄 {title}
              </h3>
            </div>

            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title={title}
              style={{ border: 'none' }}
            />
          </div>
        </div>
      )}

      {/* 图片查看器遮罩层 */}
      {isImageViewerOpen && imageUrl && !imageError && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fadeIn"
          onClick={handleImageViewerClick}
        >
          <div className="relative w-[90vw] h-[90vh] flex items-center justify-center">
            <button
              className="
                absolute top-4 right-4 z-10
                text-white text-4xl
                hover:text-gray-300
                transition-colors duration-200
                bg-black/50
                rounded-full w-12 h-12
                flex items-center justify-center
                hover:bg-black/70
              "
              onClick={handleCloseImageViewer}
            >
              ✕
            </button>

            <div className="absolute top-4 left-4 z-10">
              <h3 className="text-xl font-semibold text-white bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                🖼️ {title}
              </h3>
            </div>

            <img
              src={getImagePath(imageUrl)}
              alt={title}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onError={handleImageError}
            />
          </div>
        </div>
      )}

      {/* 全屏遮罩层 */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center animate-fadeIn"
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
                  src={getVideoPath(videoUrl)}
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
              <div className="text-black text-lg font-medium bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm">
                {title}
              </div>
              
              <button
                className="
                  text-white text-4xl
                  hover:text-gray-300
                  transition-colors duration-200
                  bg-black/50
                  rounded-full w-12 h-12
                  flex items-center justify-center
                  hover:bg-opacity-70
                "
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
                className="text-white hover:text-gray-300 transition-colors duration-200 text-sm px-3 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setScale(Math.min(scale + 0.2, 5));
                }}
                title="放大"
              >
                ➕
              </button>
              <span className="text-white text-sm min-w-[40px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                className="text-white hover:text-gray-300 transition-colors duration-200 text-sm px-3 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setScale(Math.max(scale - 0.2, 0.5));
                }}
                title="缩小"
              >
                ➖
              </button>

              <span className="text-white/30">|</span>

              <button
                className="text-white hover:text-gray-300 transition-colors duration-200 text-sm px-3 py-1"
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
                className="text-white hover:text-gray-300 transition-colors duration-200 text-sm px-3 py-1"
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
                className="text-white hover:text-gray-300 transition-colors duration-200 text-sm px-3 py-1"
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