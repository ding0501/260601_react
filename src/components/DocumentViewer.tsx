import { useState, useEffect, useRef } from "react";

type DocumentViewerProps = {
  title?: string;
  imageUrl: string;
  pdfUrl: string;
  textColor?: string;
  showBorder?: boolean;
  index?: number;
};

function DocumentViewer({ 
  title, 
  imageUrl, 
  pdfUrl, 
  textColor = "black", 
  showBorder = true,
  index 
}: DocumentViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFullscreenImageLoading, setIsFullscreenImageLoading] = useState(true);
  const [preloadedImage, setPreloadedImage] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  
  const fullscreenImgRef = useRef<HTMLImageElement>(null);
  const mainImgRef = useRef<HTMLImageElement>(null);
  const pdfIframeRef = useRef<HTMLIFrameElement>(null);
  const preloadLinkRef = useRef<HTMLLinkElement | null>(null);

  // 预加载图片
  useEffect(() => {
    if (!imageUrl) return;

    setIsImageLoading(true);
    setImageError(false);

    // 使用 Image 对象预加载
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      setIsImageLoading(false);
      setPreloadedImage(getImagePath(imageUrl));
    };
    
    img.onerror = () => {
      setIsImageLoading(false);
      setImageError(true);
    };

    img.src = getImagePath(imageUrl);

    // 预加载全屏图片（使用 link prefetch）
    if (!preloadLinkRef.current) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = getImagePath(imageUrl);
      document.head.appendChild(link);
      preloadLinkRef.current = link;
    }

    return () => {
      img.onload = null;
      img.onerror = null;
      if (preloadLinkRef.current) {
        document.head.removeChild(preloadLinkRef.current);
        preloadLinkRef.current = null;
      }
    };
  }, [imageUrl]);

  // 预加载 PDF（使用 link prefetch）
  useEffect(() => {
    if (!pdfUrl) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'document';
    link.href = pdfUrl;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [pdfUrl]);

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
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFullscreen, isPdfViewerOpen]);

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
    if (isPdfViewerOpen || isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPdfViewerOpen, isFullscreen]);

  // 获取显示标题
  const displayTitle = (() => {
    if (title) {
      return title;
    }
    if (index !== undefined && index >= 1) {
      return `编号 ${String(index).padStart(3, '0')}`;
    }
    return '未命名文档';
  })();

  // 路径处理函数
  const getImagePath = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/')) {
      return url;
    }
    return `./${url}`;
  };

  // 打开全屏时预加载高分辨率图片
  const handleOpenFullscreen = () => {
    setIsFullscreen(true);
    setIsFullscreenImageLoading(true);
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });

    // 使用 requestAnimationFrame 优化渲染
    requestAnimationFrame(() => {
      if (fullscreenImgRef.current) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          setIsFullscreenImageLoading(false);
          if (fullscreenImgRef.current) {
            fullscreenImgRef.current.src = img.src;
          }
        };
        img.onerror = () => {
          setIsFullscreenImageLoading(false);
          setImageError(true);
        };
        img.src = getImagePath(imageUrl);
      }
    });
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setIsFullscreenImageLoading(true);
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleToggleFullscreen = () => {
    if (isFullscreen) {
      handleCloseFullscreen();
    } else {
      handleOpenFullscreen();
    }
  };

  const handleViewPDF = () => {
    setIsPdfViewerOpen(true);
    setIsPdfLoading(true);
  };

  const handleClosePdfViewer = () => {
    setIsPdfViewerOpen(false);
    setIsPdfLoading(true);
  };

  const handlePdfViewerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClosePdfViewer();
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
    setIsFullscreenImageLoading(false);
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

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotate = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

  // 加载动画组件
  const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    const sizeClasses = {
      sm: "w-6 h-6 border-2",
      md: "w-12 h-12 border-3",
      lg: "w-20 h-20 border-4"
    };
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg">
        <div className="flex flex-col items-center gap-3">
          <div className={`${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full animate-spin`} />
          <span className="text-sm text-gray-600 dark:text-gray-300 animate-pulse">
            加载中...
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 带边框的卡片容器 */}
      <div
        className={`
          ${showBorder ? 'border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300' : ''}
          bg-white dark:bg-gray-800
          p-6 md:p-8 lg:p-10
          mx-4 md:mx-8 lg:mx-12
          my-4
        `}
      >
        <div
          className="flex flex-col lg:flex-row-reverse
            space-y-6 lg:space-y-0
            text-apple-text-light dark:text-apple-text-dark
            min-h-[400px] lg:min-h-[500px]
        "
        >
          {/* 图片区域 - 自适应大小 */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-full max-w-[600px] lg:max-w-[700px]">
              {isImageLoading && <LoadingSpinner size="md" />}
              <img 
                ref={mainImgRef}
                src={imageError ? '/images/placeholder.png' : getImagePath(imageUrl)} 
                alt={displayTitle}
                className={`w-full h-auto cursor-pointer rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onClick={handleOpenFullscreen}
                onError={handleImageError}
                onLoad={() => setIsImageLoading(false)}
                loading="lazy"
                style={{ 
                  transition: 'opacity 0.3s ease',
                  display: isImageLoading ? 'none' : 'block'
                }}
              />
              {/* 图片角标 */}
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                🔍 点击放大
              </div>
            </div>
          </div>

          {/* 信息区域 - 内容居中，往下调整 */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left justify-center lg:justify-center">
            <div className="space-y-6 lg:pl-8 lg:pr-4">
              {/* 标题 - 使用 displayTitle */}
              <div className={`text-4xl font-black md:text-6xl text-${textColor}`}>
                {displayTitle}
              </div>
              
              {/* 描述 */}
              <div className="font-medium text-xl md:text-2xl text-gray-600 dark:text-gray-300">
                点击图片可全屏查看、缩放、旋转
              </div>

              {/* 按钮组 - 修改后的按钮样式 */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 flex-wrap items-center">
                {/* PDF查看按钮 - 渐变蓝色 */}
                <button
                  className="
                    inline-flex items-center justify-center gap-2
                    px-6 py-3
                    bg-gradient-to-r from-blue-500 to-blue-600
                    text-white
                    rounded-xl
                    hover:from-blue-600 hover:to-blue-700
                    hover:shadow-lg hover:shadow-blue-500/30
                    active:scale-95
                    transition-all duration-300
                    font-semibold
                    text-base
                    whitespace-nowrap
                    border-0
                  "
                  onClick={handleViewPDF}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>查看PDF</span>
                </button>

                {/* 全屏按钮 - 渐变紫色 */}
                <button
                  className="
                    inline-flex items-center justify-center gap-2
                    px-6 py-3
                    bg-gradient-to-r from-purple-500 to-purple-600
                    text-white
                    rounded-xl
                    hover:from-purple-600 hover:to-purple-700
                    hover:shadow-lg hover:shadow-purple-500/30
                    active:scale-95
                    transition-all duration-300
                    font-semibold
                    text-base
                    whitespace-nowrap
                    border-0
                  "
                  onClick={handleToggleFullscreen}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isFullscreen ? "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" : "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"} />
                  </svg>
                  <span>{isFullscreen ? "退出全屏" : "全屏看图片"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF查看器遮罩层 */}
      {isPdfViewerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fadeIn"
          onClick={handlePdfViewerClick}
        >
          <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden">
            {isPdfLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
                <LoadingSpinner size="lg" />
              </div>
            )}
            
            {/* PDF关闭按钮 */}
            <button
              className="
                absolute top-4 right-4 z-30
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

            {/* PDF标题 - 使用 displayTitle */}
            <div className="absolute top-4 left-4 z-30">
              <h3 className="text-xl font-semibold text-gray-800 bg-white/90 px-4 py-2 rounded-lg shadow-lg">
                📄 {displayTitle}
              </h3>
            </div>

            {/* PDF内容 */}
            <iframe
              ref={pdfIframeRef}
              src={pdfUrl}
              className="w-full h-full relative z-10"
              title={displayTitle}
              style={{ border: 'none' }}
              onLoad={() => setIsPdfLoading(false)}
              sandbox="allow-scripts allow-same-origin"
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
            {/* 加载状态 */}
            {isFullscreenImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            )}
            
            {/* 图片容器 */}
            <div 
              className="relative"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease',
                opacity: isFullscreenImageLoading ? 0 : 1
              }}
            >
              <img 
                ref={fullscreenImgRef}
                src={imageError ? '/images/placeholder.png' : getImagePath(imageUrl)} 
                alt={displayTitle}
                className="max-w-[95vw] max-h-[95vh] object-contain select-none"
                onError={handleImageError}
                draggable={false}
                onLoad={() => setIsFullscreenImageLoading(false)}
              />
            </div>

            {/* 顶部控制栏 - 标题和关闭按钮在同一排 */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              {/* 标题 - 使用 displayTitle */}
              <div className="text-black text-lg font-medium bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm pointer-events-auto">
                {displayTitle}
              </div>
              
              {/* 关闭按钮 - 右对齐 */}
              <button
                className="
                  text-white text-4xl
                  hover:text-gray-300
                  transition-colors duration-200
                  bg-black/50
                  rounded-full w-12 h-12
                  flex items-center justify-center
                  hover:bg-opacity-70
                  pointer-events-auto
                "
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseFullscreen();
                }}
              >
                ✕
              </button>
            </div>

            {/* 底部控制按钮 - 缩放和旋转 */}
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2 pointer-events-auto">
              {/* 缩放控制 */}
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

              {/* 分隔线 */}
              <span className="text-white/30">|</span>

              {/* 旋转控制 */}
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

              {/* 分隔线 */}
              <span className="text-white/30">|</span>

              {/* 重置按钮 */}
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

            {/* 底部提示 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-xs bg-black/30 px-3 py-1 rounded-full pointer-events-none">
              🖱️ 滚轮缩放 · 拖拽移动 · 点击外部退出
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DocumentViewer;