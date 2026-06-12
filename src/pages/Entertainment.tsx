const Entertainment = () => {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      {/* 头部 */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1>🎬 欢迎来到 Entertainment</h1>
        <p style={{ color: "#666" }}>电影 · 音乐 · 游戏 · 阅读</p>
      </div>

      {/* 推荐列表 */}
      <div>
        <h2>🔥 今日推荐</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li
            style={{
              padding: "12px",
              margin: "8px 0",
              background: "#f0f0f0",
              borderRadius: "8px",
            }}
          >
            🎬 《沙丘2》—— 科幻史诗巨制
          </li>
          <li
            style={{
              padding: "12px",
              margin: "8px 0",
              background: "#f0f0f0",
              borderRadius: "8px",
            }}
          >
            🎵 周杰伦新歌 —— 年末重磅回归
          </li>
          <li
            style={{
              padding: "12px",
              margin: "8px 0",
              background: "#f0f0f0",
              borderRadius: "8px",
            }}
          >
            🎮 《黑神话：悟空》DLC 开发中
          </li>
          <li
            style={{
              padding: "12px",
              margin: "8px 0",
              background: "#f0f0f0",
              borderRadius: "8px",
            }}
          >
            📚 《三体》电视剧第二季即将开拍
          </li>
        </ul>
      </div>

      {/* 每日一句 */}
      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          background: "#e8f4f8",
          borderRadius: "8px",
        }}
      >
        <p>
          💡 <strong>每日一句：</strong>
          “放松不是浪费时间，而是让灵魂赶上来。”{" "}
        </p>
      </div>

      {/* 底部 */}
      <footer style={{ marginTop: "30px", textAlign: "center", color: "#999" }}>
        <p>🎉 享受你的娱乐时光 🎉</p>
      </footer>
    </div>
  );
};

export default Entertainment;
