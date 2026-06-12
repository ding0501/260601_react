const orders = {
  1: {
    id: 1,
    status: "pending",
    total: 7999,
    items: [{ name: "iPhone 15 Pro", qty: 1 }],
  },
  2: {
    id: 2,
    status: "approved",
    total: 12999,
    items: [{ name: "MacBook Pro", qty: 1 }],
  },
  3: {
    id: 3,
    status: "rejected",
    total: 3999,
    items: [{ name: "iPad Air", qty: 1 }],
  },
};

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { id } = req.query;
  const order = orders[id];

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ error: "订单不存在" });
  }
}
