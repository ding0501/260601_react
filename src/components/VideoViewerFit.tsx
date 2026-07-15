import { useState, useEffect, useRef } from "react";

type VideoViewerProps = {
  title?: string;
  video_1?: string;  // 右侧循环播放
  video_2?: string;  // 左侧循环播放
  textColor?: string;
  showBorder?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  index?: number;
};

function VideoViewerFit({ 
  title, 
  video_1 = "", 
  video_2 = "",
  textColor = "black", 
  showBorder = true,
  autoPlay = true,
  muted = true,
  index
}: VideoViewerProps) {
  const [videoError1, setVideoError1] = useState(false);
  const [videoError2, setVideoError2] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading1, setIsLoading1] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);
  
  const video1Ref = useRef<HTMLVideoElement>(null); // 右侧
  const video2Ref = useRef<HTMLVideoElement>(null); // 左侧
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

  const displayTitle = (() => {
    if (title) {
      return title;
    }
    if (index !== undefined && index >= 0) {
      return `编号 ${String(index + 1).padStart(3, '0')}`;
    }
    return '未命名文档';
  })();

  // 处理 ESC 键退出全屏
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        handleCloseFullscreen();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFullscreen]);

  // 全屏时禁止页面滚动
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  // 预加载和自动播放逻辑
  useEffect(() => {
    const video = video2Ref.current;
    if (!video || !video_2) return;

    // 设置预加载策略 - 预加载元数据和部分内容
    video.preload = "auto";
    
    // 加载完成后隐藏加载状态
    const handleLoadedData = () => {
      setIsLoading2(false);
    };

    const handleCanPlay = () => {
      setIsLoading2(false);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplay", handleCanPlay);

    // 如果视频已经加载完成
    if (video.readyState >= 3) {
      setIsLoading2(false);
    }

    // 自动播放
    if (autoPlay && !hasUserInteracted) {
      video.muted = true;
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [video_2, autoPlay, hasUserInteracted]);

  useEffect(() => {
    const video = video1Ref.current;
    if (!video || !video_1) return;

    video.preload = "auto";

    const handleLoadedData = () => {
      setIsLoading1(false);
    };

    const handleCanPlay = () => {
      setIsLoading1(false);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplay", handleCanPlay);

    if (video.readyState >= 3) {
      setIsLoading1(false);
    }

    if (autoPlay && !hasUserInteracted) {
      video.muted = true;
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [video_1, autoPlay, hasUserInteracted]);

  // 同步左侧视频播放状态
  useEffect(() => {
    if (video2Ref.current && video_2) {
      if (isPlaying) {
        video2Ref.current.play().catch(() => {});
      } else {
        video2Ref.current.pause();
      }
    }
  }, [isPlaying, video_2]);

  // 同步右侧视频播放状态
  useEffect(() => {
    if (video1Ref.current && video_1) {
      if (isPlaying) {
        video1Ref.current.play().catch(() => {});
      } else {
        video1Ref.current.pause();
      }
    }
  }, [isPlaying, video_1]);

  // 同步静音状态到所有视频
  useEffect(() => {
    const videos = [video1Ref.current, video2Ref.current, fullscreenVideoRef.current].filter(Boolean);
    videos.forEach(video => {
      if (video) {
        video.muted = isMuted;
      }
    });
  }, [isMuted]);

  const handleVideoError = (side: 'left' | 'right') => {
    if (side === 'left') {
      setVideoError2(true);
      setIsLoading2(false);
    } else {
      setVideoError1(true);
      setIsLoading1(false);
    }
  };

  // 路径处理函数 - 支持中文文件名
  const getVideoPath = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    let path = url.startsWith('/') ? url : `/${url}`;
    
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
      console.warn('路径编码失败，使用原始路径:', e);
    }
    
    return path;
  };

  const handleToggleMute = () => {
    setHasUserInteracted(true);
    setIsMuted(!isMuted);
  };

  const handleVideoClick = (side: 'left' | 'right') => {
    setHasUserInteracted(true);
    if (isFullscreen) {
      setIsPlaying(!isPlaying);
      return;
    }
    handleOpenFullscreen(side);
  };

  const handleOpenFullscreen = (side: 'left' | 'right') => {
    let videoSrc = '';
    let currentTime = 0;
    let videoRef = side === 'left' ? video2Ref.current : video1Ref.current;
    let videoUrl = side === 'left' ? video_2 : video_1;
    
    if (videoUrl) {
      videoSrc = getVideoPath(videoUrl);
      if (videoRef) {
        currentTime = videoRef.currentTime;
      }
    }
    
    setIsFullscreen(true);
    setIsFullscreenLoading(true);
    
    setTimeout(() => {
      if (fullscreenVideoRef.current && videoSrc) {
        // 预加载全屏视频
        fullscreenVideoRef.current.preload = "auto";
        fullscreenVideoRef.current.src = videoSrc;
        fullscreenVideoRef.current.currentTime = currentTime;
        fullscreenVideoRef.current.muted = isMuted;
        
        // 等待视频加载完成后再播放
        const playFullscreen = () => {
          fullscreenVideoRef.current?.play()
            .then(() => {
              setIsFullscreenLoading(false);
            })
            .catch(() => {
              setIsFullscreenLoading(false);
            });
        };

        // 如果视频已经加载完成，直接播放
        if (fullscreenVideoRef.current.readyState >= 3) {
          playFullscreen();
        } else {
          // 否则等待加载完成
          const handleCanPlay = () => {
            playFullscreen();
            fullscreenVideoRef.current?.removeEventListener("canplay", handleCanPlay);
          };
          fullscreenVideoRef.current.addEventListener("canplay", handleCanPlay);
          // 设置超时，防止卡死
          setTimeout(() => {
            setIsFullscreenLoading(false);
          }, 3000);
        }
      }
    }, 100);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setIsFullscreenLoading(false);
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.pause();
      fullscreenVideoRef.current.src = "";
    }
  };

  const handleFullscreenClick = () => {
    setIsPlaying(!isPlaying);
  };

  // 加载动画组件
  const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    const sizeClasses = {
      sm: "w-6 h-6 border-2",
      md: "w-10 h-10 border-3",
      lg: "w-16 h-16 border-4"
    };
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
        <div className={`${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full animate-spin`} />
      </div>
    );
  };

  return (
    <>
      <div
        className={`
          w-full h-full
          bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-gray-700/50 dark:to-gray-600/50
          backdrop-blur-sm
          p-2 sm:p-3 md:p-4
        `}
      >
        {/* 标题区域 - 缩小 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3 gap-1 sm:gap-3">
          <div className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-${textColor} flex-shrink-0`}>
            {displayTitle}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-700/50 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 flex-shrink-0">
            🎬 点击视频全屏播放
          </div>
        </div>

        {/* 视频容器 - 缩小高度和内边距 */}
        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm p-1.5 sm:p-2 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 h-[45vh] lg:h-[40vh]">
            
            {/* 左侧视频 - video_2 (装配体爆炸动画) */}
            <div 
              className="flex-1 min-h-0 group cursor-pointer p-0.5"
              onClick={() => handleVideoClick('left')}
            >
              <div className="relative w-full h-full bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <div className="absolute inset-0">
                  {!video_2 || videoError2 ? (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400 p-2">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">视频加载失败</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={video2Ref}
                        src={getVideoPath(video_2)}
                        className="w-full h-full object-contain"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoClick('left');
                        }}
                        onError={() => handleVideoError('left')}
                        playsInline
                        muted={isMuted}
                        loop
                        autoPlay={autoPlay}
                        preload="auto"
                      />
                      {isLoading2 && <LoadingSpinner size="md" />}
                    </>
                  )}
                </div>
                
                {/* 全屏提示 - 缩小 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-sm text-white text-xs sm:text-sm px-2 py-1 rounded-full">
                    ⛶ 点击全屏播放
                  </div>
                </div>
                
                {/* 顶部控制栏 - 缩小 */}
                <div className="absolute top-1 left-1 right-1 flex items-center justify-between pointer-events-none">
                  <div className="bg-black/50 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-full pointer-events-auto">
                    🔄 爆炸动画
                  </div>
                  
                  <div className="flex items-center gap-1 pointer-events-auto">
                    <div className="bg-black/50 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {isPlaying ? '▶' : '⏸'}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMute();
                      }}
                      className="bg-black/50 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded-full hover:bg-black/70 transition-colors w-5 h-5 flex items-center justify-center pointer-events-auto"
                      title={isMuted ? "取消静音" : "静音"}
                    >
                      {isMuted ? '🔇' : '🔊'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧视频 - video_1 (装配体旋转) */}
            <div 
              className="flex-1 min-h-0 group cursor-pointer p-0.5"
              onClick={() => handleVideoClick('right')}
            >
              <div className="relative w-full h-full bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <div className="absolute inset-0">
                  {!video_1 || videoError1 ? (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400 p-2">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">视频加载失败</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={video1Ref}
                        src={getVideoPath(video_1)}
                        className="w-full h-full object-contain"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoClick('right');
                        }}
                        onError={() => handleVideoError('right')}
                        playsInline
                        muted={isMuted}
                        loop
                        autoPlay={autoPlay}
                        preload="auto"
                      />
                      {isLoading1 && <LoadingSpinner size="md" />}
                    </>
                  )}
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-sm text-white text-xs sm:text-sm px-2 py-1 rounded-full">
                    ⛶ 点击全屏播放
                  </div>
                </div>
                
                <div className="absolute top-1 left-1 right-1 flex items-center justify-between pointer-events-none">
                  <div className="bg-black/50 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-full pointer-events-auto">
                    🔄 旋转动画
                  </div>
                  
                  <div className="flex items-center gap-1 pointer-events-auto">
                    <div className="bg-black/50 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {isPlaying ? '▶' : '⏸'}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMute();
                      }}
                      className="bg-black/50 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded-full hover:bg-black/70 transition-colors w-5 h-5 flex items-center justify-center pointer-events-auto"
                      title={isMuted ? "取消静音" : "静音"}
                    >
                      {isMuted ? '🔇' : '🔊'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 全屏遮罩层 - 保持不变 */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={handleCloseFullscreen}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {isFullscreenLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <LoadingSpinner size="lg" />
              </div>
            )}
            <video
              ref={fullscreenVideoRef}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => {
                e.stopPropagation();
                handleFullscreenClick();
              }}
              playsInline
              muted={isMuted}
              loop
              autoPlay
              controls
              preload="auto"
            />
            
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors duration-200 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 z-20"
              onClick={handleCloseFullscreen}
            >
              ✕
            </button>

            <div className="absolute top-4 left-4 flex items-center gap-3 z-20">
              <div className="text-white text-lg font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                {displayTitle}
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm z-20">
              🖱️ 点击视频切换播放/暂停 | 点击外部或按 ESC 退出全屏
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VideoViewerFit;