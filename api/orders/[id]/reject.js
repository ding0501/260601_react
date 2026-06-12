export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { id } = req.query;

  if (req.method === "POST") {
    res.status(200).json({
      message: `订单 ${id} 已拒绝`,
      orderId: id,
      status: "rejected",
      metadata: req.body.metadata,
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
