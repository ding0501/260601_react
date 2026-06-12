export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.status(200).json([
    {
      id: 4,
      name: "iPhone 16",
      price: 8999,
      image: "/images/iphone16.jpg",
      category: "手机",
      isNew: true,
    },
    {
      id: 5,
      name: "MacBook Air M3",
      price: 9999,
      image: "/images/macbookair.jpg",
      category: "电脑",
      isNew: true,
    },
    {
      id: 6,
      name: "iPad Pro 2024",
      price: 6999,
      image: "/images/ipadpro.jpg",
      category: "平板",
      isNew: true,
    },
  ]);
}
