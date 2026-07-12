import { ReactNode } from "react";

interface DisclaimerProps {
  children?: ReactNode;
  text?: string; // 允许自定义文本
}

const Disclaimer = ({ children, text }: DisclaimerProps) => {
  // 使用创意标语作为默认文本
  const displayText = text || "把时间留给创意，把图纸交给我。";

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-8 md:px-8 md:py-10">
      {/* 标题容器 - 磨玻璃效果，宽度自适应 */}
      <div className="w-full max-w-7xl">
        <div className="relative inline-block w-full">
          {/* 发光背景光晕 */}
          <div 
            className="absolute inset-0 blur-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-20 rounded-2xl"
            style={{
              animation: 'pulse 2s ease-in-out infinite'
            }}
          ></div>
          
          {/* 主容器 - 磨玻璃效果 */}
          <div className="
            relative
            w-full 
            rounded-2xl 
            border 
            border-white/20
            bg-white/20 
            backdrop-blur-2xl
            shadow-2xl 
            overflow-hidden
            p-6 
            sm:p-8 
            md:p-10 
            lg:p-14
          ">
            {/* 磨玻璃背景纹理 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
            
            {/* 装饰光效 */}
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-36 h-36 sm:w-48 sm:h-48 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
            
            {/* 文字内容 */}
            <div className="relative z-10 space-y-4 sm:space-y-5 md:space-y-6">
              {/* 主标题 - 创意标语 */}
              <h1 
                className="
                  relative 
                  text-3xl 
                  sm:text-4xl 
                  md:text-5xl 
                  lg:text-6xl 
                  xl:text-7xl 
                  font-bold 
                  leading-tight 
                  bg-gradient-to-r 
                  from-cyan-300 
                  via-blue-400 
                  to-purple-400 
                  bg-clip-text 
                  text-transparent
                  break-words
                "
                style={{
                  backgroundSize: '200% auto',
                  animation: 'gradient 3s ease-in-out infinite'
                }}
              >
                {displayText}
              </h1>

              {/* 副标题 - 技能与服务描述 - 使用深色高对比度 */}
              <p className="
                text-base 
                sm:text-lg 
                md:text-xl 
                lg:text-2xl 
                xl:text-3xl 
                text-slate-800
                font-medium
                max-w-4xl 
                mx-auto 
                leading-relaxed
                break-words
              ">
                精通 <span className="text-blue-600 font-bold">AutoCAD</span> 与 <span className="text-cyan-600 font-bold">SolidWorks</span>，
                提供从2D施工图到3D机械设计的<strong className="text-slate-900 font-bold">全流程代画服务</strong>。
                <br className="hidden sm:block" />
                {/* <span className="inline-block mt-1 sm:mt-2 text-emerald-700 font-semibold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl break-words">7x24小时响应，交付即所得。</span> */}
              </p>
            </div>

            {/* 子组件内容 */}
            {children}
          </div>
        </div>
      </div>

      {/* 添加关键帧动画 */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Disclaimer;