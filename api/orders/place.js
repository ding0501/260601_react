let orders = [];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "POST") {
    const { items, total, address, payment } = req.body;

    // 验证购物车是否为空
    if (!items || items.length === 0) {
      return res.status(400).json({
        error: "购物车为空",
        message: "请先添加商品到购物车",
      });
    }

    const newOrder = {
      id: orders.length + 1,
      orderNumber: `ORD${Date.now()}`,
      items: items,
      total: total,
      address: address,
      payment: payment,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);

    return res.status(201).json({
      success: true,
      message: "订单创建成功",
      data: newOrder,
    });
  }

  res.status(405).json({ error: "Method not allowed" });
}
