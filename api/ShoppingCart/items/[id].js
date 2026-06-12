let cartItems = [];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "DELETE") {
    const { id } = req.query;
    const itemId = parseInt(id);

    cartItems = cartItems.filter((item) => item.id !== itemId);
    return res.status(200).json({ message: "删除成功" });
  }

  res.status(405).json({ error: "Method not allowed" });
}
