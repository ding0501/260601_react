const products = [
  { id: 1, name: "iPhone 15 Pro", price: 7999, category: "手机" },
  { id: 2, name: "MacBook Pro", price: 12999, category: "电脑" },
  { id: 3, name: "iPad Air", price: 3999, category: "平板" },
  { id: 4, name: "iPhone 15", price: 5999, category: "手机" },
  { id: 5, name: "MacBook Air", price: 8999, category: "电脑" },
  { id: 6, name: "iPad Pro", price: 6999, category: "平板" },
];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { title } = req.query;
  const filtered = products.filter((p) => p.category === title);

  res.status(200).json(filtered);
}
