let cartItems = [];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "POST") {
    const { productId, name, price, qty = 1 } = req.body;

    // 验证必填字段
    if (!productId || !name) {
      return res.status(400).json({
        error: "缺少必要字段",
        message: "productId 和 name 不能为空",
      });
    }

    const newItem = {
      id: Date.now(),
      productId,
      name,
      price,
      qty,
      addedAt: new Date().toISOString(),
    };
    cartItems.push(newItem);
    return res.status(201).json({
      success: true,
      message: "添加成功",
      data: newItem,
    });
  }

  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      data: cartItems,
    });
  }

  res.status(405).json({ error: "Method not allowed" });
}
