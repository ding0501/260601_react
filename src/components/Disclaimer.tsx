import { ReactNode } from "react";

interface DisclaimerProps {
  children?: ReactNode;
  text?: string; // 允许自定义文本
}

const Disclaimer = ({ children, text }: DisclaimerProps) => {
  const displayText = text || "此网页是个人练习前端的一个练习项目，与Apple无关联。";

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-8 md:px-12 md:py-10">
      {/* 标题容器 - 磨玻璃效果 */}
      <div className="max-w-5xl w-full">
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
            bg-white/10 
            backdrop-blur-2xl
            shadow-2xl 
            overflow-hidden
            p-6 
            md:p-10
          ">
            {/* 磨玻璃背景纹理 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
            
            {/* 装饰光效 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
            
            {/* 文字内容 */}
            <div className="relative z-10">
              <h1 
                className="
                  relative 
                  text-2xl 
                  md:text-4xl 
                  font-bold 
                  leading-relaxed 
                  bg-gradient-to-r 
                  from-cyan-400 
                  via-blue-500 
                  to-purple-600 
                  bg-clip-text 
                  text-transparent
                "
                style={{
                  backgroundSize: '200% auto',
                  animation: 'gradient 3s ease-in-out infinite'
                }}
              >
                {displayText}
              </h1>
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