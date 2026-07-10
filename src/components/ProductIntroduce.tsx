import { ReactNode } from "react";

interface ProductIntroduceProps {
  children?: ReactNode;
}

const ProductIntroduce = ({ children }: ProductIntroduceProps) => {
  return (
    <div className="px-4 py-6">
      {/* 卡片容器 - 磨玻璃效果 */}
      <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        {/* 磨玻璃背景纹理 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
        
        {/* 装饰光效 - 增强磨玻璃通透感 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl"></div>

        {/* 主内容区 */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-8 md:px-12 md:py-10">
          {/* 自我介绍文字 */}
          <div className="max-w-4xl">
            {/* 特效文字 - 渐变 + 发光 */}
            <div className="relative inline-block">
              {/* 发光背景光晕 */}
              <div 
                className="absolute inset-0 blur-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-30"
                style={{
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              ></div>
              
              <h1 
                className="relative text-3xl md:text-5xl font-bold leading-relaxed bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                style={{
                  backgroundSize: '200% auto',
                  animation: 'gradient 3s ease-in-out infinite'
                }}
              >
                欢迎来到我的SolidWorks作品展示页
              </h1>
            </div>
            
            {/* 修改点：添加 max-w-4xl 控制宽度，让文字在宽屏时自然折行 */}
            <p 
              className="text-slate-800 text-base md:text-xl lg:text-2xl font-medium leading-relaxed mt-4 mx-auto max-w-4xl px-2"
              style={{
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              我在寻找新的工作机会。从零部件装配图到三维模型图，这些三维模型由我独立完成，全流程展现出我对SolidWorks从抽象构想到实体呈现的成熟驾驭力。
            </p>
            <p 
              className="text-slate-600 text-sm md:text-base mt-3 leading-relaxed max-w-full mx-auto px-2"
              style={{
                animation: 'fadeInUp 0.8s ease-out forwards',
                animationDelay: '200ms',
                opacity: 0
              }}
            >
              这些作品系统展示了我对SolidWorks的驾驭能力，核心在于能将抽象零件转化为可见的三维模型。
            </p>
          </div>
          
          {/* 子组件内容 */}
          {children}
        </div>
      </div>

      {/* 添加关键帧动画 */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default ProductIntroduce;