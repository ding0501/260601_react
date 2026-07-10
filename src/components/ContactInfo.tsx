import { ReactNode } from "react";

interface ContactInfoProps {
  children?: ReactNode;
}

const ContactInfo = ({ children }: ContactInfoProps) => {
  // 联系方式数据
  const contactItems = [
    {
      label: "微信",
      value: "18230949883",
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm6.816 3.812c-.833 0-1.64.19-2.348.514-1.576-.168-3.71.306-5.08 1.397-1.473 1.172-2.232 2.96-2.232 4.674 0 2.472 2.067 4.478 4.618 4.478.407 0 .803-.048 1.18-.144a.897.897 0 01.807.166l1.613.992c.111.064.235.084.354.084.274 0 .497-.226.497-.502 0-.068-.019-.133-.048-.196l-.327-1.24a.566.566 0 01.173-.604c1.282-.976 2.046-2.354 2.046-3.836 0-1.653-.978-3.11-2.523-3.875a4.39 4.39 0 00-1.856-.392zm-1.706 2.818a.942.942 0 01-.933-.952c0-.525.418-.952.933-.952.515 0 .933.427.933.952a.942.942 0 01-.933.952zm4.402 0a.942.942 0 01-.933-.952c0-.525.418-.952.933-.952.515 0 .933.427.933.952a.942.942 0 01-.933.952z"/>
        </svg>
      )
    },
    {
      label: "QQ",
      value: "2309712485",
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.7 12.3c-.2.2-.4.3-.7.3h-6c-.3 0-.5-.1-.7-.3-.2-.2-.3-.4-.3-.7s.1-.5.3-.7c.2-.2.4-.3.7-.3h6c.3 0 .5.1.7.3.2.2.3.4.3.7s-.1.5-.3.7zm0-3c-.2.2-.4.3-.7.3h-6c-.3 0-.5-.1-.7-.3-.2-.2-.3-.4-.3-.7s.1-.5.3-.7c.2-.2.4-.3.7-.3h6c.3 0 .5.1.7.3.2.2.3.4.3.7s-.1.5-.3.7z"/>
        </svg>
      )
    },
    {
      label: "QQ邮箱",
      value: "2309712485@qq.com",
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      )
    },
    {
      label: "电话",
      value: "18230949883",
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      )
    }
  ];

  // 复制功能
  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-green-500 text-white rounded-xl shadow-lg text-base font-medium backdrop-blur-sm bg-opacity-90 transition-all duration-300';
        toast.textContent = '✅ 已复制：' + text;
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translate(-50%, -20px)';
          setTimeout(() => toast.remove(), 300);
        }, 2000);
      }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        alert('已复制：' + text);
      });
    }
  };

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
          {/* 标题 */}
          <div className="max-w-4xl mb-8">
            <div className="relative inline-block">
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
                联系方式
              </h1>
            </div>
            
            <p 
              className="text-slate-700 text-base md:text-lg font-medium leading-relaxed mt-3 max-w-2xl mx-auto px-2"
              style={{
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              欢迎随时与我联系，期待与您合作
            </p>
          </div>

          {/* 联系方式网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
            {contactItems.map((item, index) => (
              <div
                key={item.label}
                onClick={() => handleCopy(item.value)}
                className="group relative bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                style={{
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  animationDelay: `${index * 100 + 300}ms`,
                  opacity: 0
                }}
              >
                {/* 卡片悬停光效 */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center justify-start gap-4">
                  {/* 图标 - 固定尺寸不压缩 */}
                  <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                    {item.icon}
                  </div>
                  
                  {/* 信息 - 统一字体大小，确保所有信息在一行显示 */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-xs md:text-sm text-slate-500 font-medium uppercase tracking-wider mb-0.5">
                      {item.label}
                    </div>
                    {/* 统一字体大小：根据QQ邮箱长度调整为合适尺寸，确保所有信息一行显示 */}
                    <div className="text-slate-800 text-base md:text-lg lg:text-xl font-semibold whitespace-nowrap group-hover:text-blue-600 transition-colors duration-300">
                      {item.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 一键复制提示 */}
          <div className="mt-6 text-slate-500 text-xs md:text-sm">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              点击任意卡片即可复制对应信息
            </span>
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

export default ContactInfo;