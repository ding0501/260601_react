// 模拟购物车数据（实际应该关联用户）
let cart = [];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  // 获取购物车
  if (req.method === "GET") {
    return res.status(200).json(cart);
  }

  // 清空购物车
  if (req.method === "DELETE") {
    cart = [];
    return res.status(200).json({ message: "购物车已清空" });
  }

  res.status(405).json({ error: "Method not allowed" });
}
