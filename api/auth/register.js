// 模拟用户数据库（实际应用应该用真实数据库）
const users = [];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password, ConfirmPassword } = req.body;

  // 验证
  if (!username || !password) {
    return res.status(400).json({ error: "用户名和密码不能为空" });
  }

  if (password !== ConfirmPassword) {
    return res.status(400).json({ error: "两次密码不一致" });
  }

  // 检查用户是否已存在
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: "用户名已存在" });
  }

  // 保存用户（实际应用应该加密密码并存入数据库）
  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);

  res.status(201).json({ message: "注册成功", userId: newUser.id });
}
