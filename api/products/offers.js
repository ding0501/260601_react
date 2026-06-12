export default function handler(req, res) {
  // 允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.status(200).json([
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 7999,
      originalPrice: 8999,
      discount: 11,
      image: "/images/iphone15pro.jpg",
      category: "手机",
    },
    {
      id: 2,
      name: "MacBook Pro 14",
      price: 12999,
      originalPrice: 14999,
      discount: 13,
      image: "/images/macbook.jpg",
      category: "电脑",
    },
    {
      id: 3,
      name: "iPad Air",
      price: 3999,
      originalPrice: 4799,
      discount: 17,
      image: "/images/ipad.jpg",
      category: "平板",
    },
  ]);
}
