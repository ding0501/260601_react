const users = [{ id: 1, username: "alex3", password: "MyPassw0rd!" }];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    // 生成简单的 token（实际应用应该用 JWT）
    const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
    res.status(200).json({
      message: "登录成功",
      token: token,
      username: username,
    });
  } else {
    res.status(401).json({ error: "用户名或密码错误" });
  }
}
