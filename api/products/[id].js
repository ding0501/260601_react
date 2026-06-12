const products = {
  1: {
    id: 1,
    name: "iPhone 15 Pro",
    price: 7999,
    category: "手机",
    image: "/images/iphone15pro.jpg",
    description: "A17 Pro芯片, 钛金属设计",
    stock: 50,
  },
  2: {
    id: 2,
    name: "MacBook Pro 14",
    price: 12999,
    category: "电脑",
    image: "/images/macbook.jpg",
    description: "M3 Pro芯片, 14英寸",
    stock: 30,
  },
  3: {
    id: 3,
    name: "iPad Air",
    price: 3999,
    category: "平板",
    image: "/images/ipad.jpg",
    description: "M1芯片, 10.9英寸",
    stock: 45,
  },
};

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { id } = req.query;
  const product = products[id];

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ error: "商品不存在" });
  }
}
