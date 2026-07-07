import React from 'react';

// ============================================================
// 辅助子组件
// ============================================================

/** 章节标题 */
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: '2rem' }}>
    <div
      style={{
        fontSize: '1.1rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        color: '#0a1e32',
        borderLeft: '5px solid #256bb0',
        paddingLeft: '0.9rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <span
        style={{
          background: '#256bb0',
          color: 'white',
          width: '26px',
          height: '26px',
          borderRadius: '30px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.85rem',
          fontStyle: 'normal',
        }}
      >
        {title.split(' ')[0]}
      </span>
      {title.split(' ').slice(1).join(' ')}
    </div>
    {children}
  </div>
);

/** 技能标签 */
const SkillTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      padding: '0.4rem 1.2rem',
      borderRadius: '40px',
      fontSize: '0.9rem',
      fontWeight: 450,
      color: '#1a3757',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    }}
  >
    {children}
  </span>
);

/** 项目条目 */
const ProjectItem: React.FC<{ title: string; company: string; desc: React.ReactNode }> = ({
  title,
  company,
  desc,
}) => (
  <div style={{ marginTop: '1.2rem', paddingLeft: '0.2rem' }}>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontWeight: 600,
        fontSize: '1rem',
        color: '#0a1e32',
        marginBottom: '0.2rem',
      }}
    >
      <span>{title}</span>
      <span
        style={{
          fontWeight: 500,
          color: '#1a5280',
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          padding: '0.1rem 1.2rem',
          borderRadius: '40px',
          fontSize: '0.8rem',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {company}
      </span>
    </div>
    <div
      style={{
        margin: '0.3rem 0 0.2rem 0',
        fontSize: '0.95rem',
        color: '#1f334a',
        paddingLeft: '0.2rem',
      }}
    >
      {desc}
    </div>
  </div>
);

/** 小徽章 */
const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      background: 'rgba(37, 107, 176, 0.15)',
      borderRadius: '40px',
      padding: '0.1rem 1rem',
      fontSize: '0.8rem',
      color: '#17406b',
      fontWeight: 500,
      display: 'inline-block',
      marginRight: '0.3rem',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
    }}
  >
    {children}
  </span>
);

/** 联系方式标签 */
const ContactChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      background: 'rgba(255,255,255,0.5)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      padding: '0.2rem 1rem',
      borderRadius: '30px',
      fontSize: '0.85rem',
      fontWeight: 500,
      color: '#1f3a5f',
      whiteSpace: 'nowrap',
      display: 'inline-block',
      width: 'fit-content',
      border: '1px solid rgba(255,255,255,0.2)',
    }}
  >
    {children}
  </span>
);

// ============================================================
// 主组件：磨玻璃简历 (融合第一段布局风格)
// ============================================================
const GlassResume: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: '1024px',
        width: '100%',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '40px',
        boxShadow: '0 30px 60px -16px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        padding: '2.6rem 3rem',
        margin: '0 auto',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: '#142433',
        lineHeight: 1.5,
      }}
    >
      {/* ----- 装饰光晕 ----- */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-60px',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-60px',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.20) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ----- 主内容 (z-index 上层) ----- */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* ===== 头部：参照第一段布局 ===== */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            marginBottom: '1.4rem',
            paddingBottom: '1.4rem',
            borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
              flexWrap: 'wrap',
            }}
          >
            {/* 照片 */}
            <img
              src="/documents/AutoCAD/期待的OFFER.png"
              alt="照片"
              style={{
                width: '300px',
                height: '215px',
                objectFit: 'cover',
                borderRadius: '18px',
                border: '3px solid rgba(255,255,255,0.6)',
                boxShadow: '0 8px 18px -6px rgba(20, 50, 80, 0.18)',
                background: '#f0f6fe',
                flexShrink: 0,
              }}
            />
            <div>
              <h1
                style={{
                  fontSize: '3.2rem',
                  fontWeight: 650,
                  letterSpacing: '-0.02em',
                  color: '#0a1e32',
                  lineHeight: 1.1,
                  marginBottom: '0.2rem',
                }}
              >
                D  Y
              </h1>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem 0.8rem',
                  marginTop: '0.3rem',
                }}
              >
                <span
                  style={{
                    background: 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    padding: '0.25rem 1rem',
                    borderRadius: '40px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: '#1f3f62',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    whiteSpace: 'nowrap',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  👤 男 · 26岁
                </span>
              </div>
            </div>
          </div>

          {/* 联系方式：使用 ContactChip 垂直排列，无“快速联系”字样 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem 0',
              fontSize: '0.9rem',
              color: '#1e2a3a',
              marginTop: '0.2rem',
              alignItems: 'flex-start',
            }}
          >
            <ContactChip>📱 18230949883</ContactChip>
            <ContactChip>
              📧 <a href="mailto:2309712485@qq.com" style={{ color: '#1f3a5f', textDecoration: 'none', fontWeight: 500 }}>
                2309712485@qq.com
              </a>
            </ContactChip>
            <ContactChip>📍 深圳</ContactChip>
          </div>
        </div>

        {/* ===== 求职意向 ===== */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            padding: '0.6rem 1.4rem',
            borderRadius: '60px',
            display: 'inline-block',
            marginBottom: '1.4rem',
            fontWeight: 500,
            fontSize: '0.95rem',
            color: '#0f2b4f',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 2px 6px rgba(0, 40, 80, 0.04)',
          }}
        >
          <strong>🎯 求职意向：</strong>产品研发助理工程师（包装/印刷方向）&nbsp;·&nbsp;期望城市：深圳
        </div>

        {/* ===== 作品集 ===== */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            padding: '0.5rem 1.4rem',
            borderRadius: '60px',
            display: 'inline-flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.3rem 0.8rem',
            margin: '0 0 1.6rem 0',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '0.9rem',
          }}
        >
          <span>🖥️ 作品集</span>
          <a
            href="https://ding123.website/AutoCAD"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#004080',
              fontWeight: 500,
              textDecoration: 'none',
              wordBreak: 'break-all',
              borderBottom: '1px dashed rgba(0, 64, 128, 0.4)',
            }}
          >
            https://ding123.website/AutoCAD
          </a>
          <span
            style={{
              color: '#4b6f92',
              fontSize: '0.8rem',
              background: 'rgba(255,255,255,0.3)',
              padding: '0.1rem 0.8rem',
              borderRadius: '40px',
            }}
          >
            电脑端浏览更佳
          </span>
        </div>

        {/* ===== 教育背景 ===== */}
        <Section title="🎓 教育背景">
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              padding: '0.7rem 1.4rem',
              borderRadius: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#0a1e32' }}>
              长春工业大学人文信息学院
            </span>
            <span
              style={{
                color: '#1f4068',
                background: 'rgba(255,255,255,0.4)',
                padding: '0.1rem 1rem',
                borderRadius: '40px',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              计算机科学与技术
            </span>
            <span style={{ color: '#3a5b7c', fontSize: '0.9rem' }}>本科 · 工学学士</span>
          </div>
        </Section>

        {/* ===== 核心优势 ===== */}
        <Section title="⚡ 核心优势">
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              padding: '1.2rem 1.6rem',
              borderRadius: '24px',
              borderLeft: '6px solid #256bb0',
              margin: '0.2rem 0 0.4rem 0',
              fontSize: '0.98rem',
              color: '#142433',
              textIndent: '2em',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <p style={{ textIndent: '2em', marginBottom: '0.25rem' }}>
              计算机科班出身，具备扎实的系统逻辑与数据思维，能深刻理解ERP/MES系统在产品研发中的数据流转逻辑，擅长从"系统数据"角度规划BOM与工艺路线。同时，通过系统自学与大量实操，掌握了扎实的工程制图理论与AutoCAD实战技能，空间想象力突出，能高效完成三维构思向二维工程图纸的精准转化。兼具"技术思维"与"工程落地"能力，旨在成为设计与生产数字化贯通的新型研发人才。
            </p>
          </div>
        </Section>

        {/* ===== 专业技能 ===== */}
        <Section title="🛠️ 专业技能">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.7rem 1rem',
            }}
          >
            <SkillTag>
              <strong>设计软件：</strong>熟练使用 AutoCAD，独立完成精确二维工程图、尺寸公差标注及规范出图，图纸可直接对接生产打样。
            </SkillTag>
            <SkillTag>
              <strong>工程素养：</strong>系统掌握投影理论、三视图原理及国家制图标准，空间想象能力丰富，快速通过平面图纸构想产品立体形态。
            </SkillTag>
            <SkillTag>
              <strong>系统与办公：</strong>具备ERP/MES系统逻辑基础，快速理解物料编码、BOM录入、工艺路线维护等模块。精通Word、Excel、PPT及项目管理工具。
            </SkillTag>
            <SkillTag>
              <strong>IT与部署：</strong>熟悉Windows系统环境配置，独立完成AutoCAD等专业设计软件的安装、授权配置及常见运行故障排查。
            </SkillTag>
            <SkillTag>
              <strong>语言能力：</strong>英语CET-4，可阅读英文技术资料。
            </SkillTag>
          </div>
        </Section>

        {/* ===== 项目与研发相关经历 ===== */}
        <Section title="📁 项目与研发相关经历">
          {/* 项目1 */}
          <ProjectItem
            title="个人CAD作品集（独立练习）"
            company="个人项目"
            desc={
              <>
                <div style={{ marginBottom: '0.3rem' }}>
                  <Badge>项目概述</Badge> 为匹配包装印刷行业对工程制图能力的要求，自主进行大量工程图绘制练习，作品涵盖三视图、轴测图、建筑平面图及创意结构图，并建立个人作品展示网站。
                </div>
                <ul style={{ listStyle: 'none', marginTop: '0.3rem', paddingLeft: 0 }}>
                  <li style={{ position: 'relative', paddingLeft: '1.4rem', marginBottom: '0.35rem', fontSize: '0.93rem' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#256bb0', fontWeight: 600 }}>▹</span>
                    <strong>标准化出图：</strong>独立完成20余幅符合国家标准的工程图纸，严格标注尺寸与技术要求，体现严谨的制图规范意识。
                  </li>
                  <li style={{ position: 'relative', paddingLeft: '1.4rem', marginBottom: '0.35rem', fontSize: '0.93rem' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#256bb0', fontWeight: 600 }}>▹</span>
                    <strong>结构数字化转化：</strong>针对包装设计需求，专项练习将三维立体构思转化为二维CAD工程图，输出图纸可无缝对接BOM清单中的尺寸参数录入，实现设计与数据的初步贯通。
                  </li>
                </ul>
              </>
            }
          />

          {/* 项目2 */}
          <ProjectItem
            title="长春市壹加壹餐饮管理有限公司 · 门店运营助理"
            company="运营优化 / 打样思维"
            desc={
              <ul style={{ listStyle: 'none', marginTop: '0.3rem', paddingLeft: 0 }}>
                <li style={{ position: 'relative', paddingLeft: '1.4rem', marginBottom: '0.35rem', fontSize: '0.93rem' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#256bb0', fontWeight: 600 }}>▹</span>
                  <strong>流程优化与打样思维模拟：</strong>针对日均100+客流高峰时段堵点，自主分析并重新设计动线与作业SOP，将出餐效率提升15%。该过程完整模拟了产品研发中"打样-测试-优化"的闭环思维，能快速定位样品试制问题并推动改善。
                </li>
                <li style={{ position: 'relative', paddingLeft: '1.4rem', marginBottom: '0.35rem', fontSize: '0.93rem' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#256bb0', fontWeight: 600 }}>▹</span>
                  <strong>跨部门协同与应急处理：</strong>独立负责物料库存预警与突发缺货协调，处理客诉及现场突发状况20余起，均妥善解决，无事件升级。积累了在压力下与采购、生产、质量等多部门高效沟通、协同解决问题的实战经验。
                </li>
              </ul>
            }
          />
        </Section>

        {/* ===== 个人优势 ===== */}
        <Section title="🌟 个人优势">
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              padding: '1rem 1.6rem',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 2px 8px rgba(0, 30, 60, 0.03)',
            }}
          >
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>“技术+工程”复合思维：</strong>能站在系统高度理解产品数据（BOM、工艺路线）的流转逻辑，同时具备将设计构想转化为精准工程图纸的落地能力，致力于成为连接研发设计与生产制造的桥梁。
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>极强的自驱与学习能力：</strong>拥有独立从0到1完成项目的完整经验（个人网站与CAD作品集）。对包装结构设计软件（如AutoCAD）保持学习热情，承诺入职半个月内达到独立完成结构设计出图的水平，确保快速胜任岗位。
            </div>
            <div>
              <strong>责任心与沟通力：</strong>一线运营经历锤炼出强烈的责任心和换位思考能力，善于协同内外部团队，高效推动产品开发目标达成。
            </div>
          </div>
        </Section>

        {/* ===== 获奖信息 ===== */}
        <Section title="🏆 获奖信息">
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              padding: '0.5rem 1.6rem',
              borderRadius: '40px',
              display: 'inline-block',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: '#0a2a4a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <strong style={{ fontWeight: 600, color: '#00337a' }}>
              长春工业大学人文信息学院二等奖学金
            </strong>
            （专业排名前12%）
          </div>
        </Section>
      </div>
    </div>
  );
};

export default GlassResume;