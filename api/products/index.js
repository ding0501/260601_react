// 商品数据库
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 7999,
    category: "手机",
    image: "/images/iphone15pro.jpg",
    description: "最新款iPhone",
  },
  {
    id: 2,
    name: "MacBook Pro 14",
    price: 12999,
    category: "电脑",
    image: "/images/macbook.jpg",
    description: "M3芯片",
  },
  {
    id: 3,
    name: "iPad Air",
    price: 3999,
    category: "平板",
    image: "/images/ipad.jpg",
    description: "轻便便携",
  },
  {
    id: 4,
    name: "iPhone 15",
    price: 5999,
    category: "手机",
    image: "/images/iphone15.jpg",
    description: "性价比之选",
  },
  {
    id: 5,
    name: "MacBook Air",
    price: 8999,
    category: "电脑",
    image: "/images/macbookair.jpg",
    description: "轻薄本",
  },
  {
    id: 6,
    name: "iPhone 14",
    price: 4999,
    category: "手机",
    image: "/images/iphone14.jpg",
    description: "经典款",
  },
  {
    id: 7,
    name: "iPad mini",
    price: 3499,
    category: "平板",
    image: "/images/ipadmini.jpg",
    description: "小巧便携",
  },
  {
    id: 8,
    name: "Mac Studio",
    price: 29999,
    category: "电脑",
    image: "/images/macstudio.jpg",
    description: "专业工作站",
  },
];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { keyword } = req.query;

  if (keyword) {
    // 搜索功能
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase()),
    );
    return res.status(200).json(filtered);
  }

  // 返回所有商品
  res.status(200).json(products);
}
