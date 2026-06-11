// api/proxy/[...path].js
export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 处理预检请求
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 目标后端地址
  const targetUrl = `http://152.136.182.210:12231${req.url}`;

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // 转发认证 token
    if (req.headers.authorization) {
      fetchOptions.headers.Authorization = req.headers.authorization;
    }

    // 转发请求体
    if (req.method !== "GET" && req.method !== "HEAD") {
      fetchOptions.body = JSON.stringify(req.body);
    }

    console.log(`Proxying ${req.method} ${req.url} -> ${targetUrl}`);

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "Failed to proxy request",
      message: error.message,
      targetUrl,
    });
  }
}
