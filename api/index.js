// api/index.js - 统一处理所有 API 请求
export default function handler(req, res) {
  // 允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 处理预检请求
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { url, method, query, body } = req;

  // 解析路径（去掉查询参数）
  const path = url.split("?")[0];

  console.log(`API 调用: ${method} ${path}`);

  // ========== 商品相关 API ==========

  // 获取商品列表或搜索商品
  if (path === "/api/products" && method === "GET") {
    const { keyword } = query;
    const products = getProducts(keyword);
    return res.status(200).json(products);
  }

  // 获取单个商品详情
  if (
    path.startsWith("/api/products/") &&
    !path.includes("offers") &&
    !path.includes("newarrivals")
  ) {
    const id = path.split("/").pop();
    const product = getProductById(id);
    if (product) {
      return res.status(200).json(product);
    }
    return res.status(404).json({ error: "商品不存在" });
  }

  // 获取优惠商品
  if (path === "/api/products/offers") {
    return res.status(200).json(getOffers());
  }

  // 获取新品
  if (path === "/api/products/newarrivals") {
    return res.status(200).json(getNewArrivals());
  }

  // ========== 分类相关 API ==========

  // 根据分类获取商品
  if (path.startsWith("/api/categories/")) {
    const title = decodeURIComponent(path.split("/").pop());
    return res.status(200).json(getProductsByCategory(title));
  }

  // ========== 认证相关 API ==========

  // 注册
  if (path === "/api/auth/register" && method === "POST") {
    return handleRegister(req, res);
  }

  // 登录
  if (path === "/api/auth/login" && method === "POST") {
    return handleLogin(req, res);
  }

  // ========== 购物车相关 API ==========

  // 获取购物车
  if (path === "/api/ShoppingCart" && method === "GET") {
    return res.status(200).json(getCart());
  }

  // 添加商品到购物车
  if (path === "/api/ShoppingCart/items" && method === "POST") {
    return addToCart(req, res);
  }

  // 删除购物车商品
  if (path.startsWith("/api/ShoppingCart/items/") && method === "DELETE") {
    const id = parseInt(path.split("/").pop());
    return removeFromCart(id, res);
  }

  // 清空购物车
  if (path === "/api/ShoppingCart/items" && method === "DELETE") {
    return clearCart(res);
  }

  // 获取假购物车数据（测试用）
  if (path === "/api/ShoppingCart/fake-shopping-cart") {
    return res.status(200).json(getFakeCart());
  }

  // ========== 订单相关 API ==========

  // 下单
  if (path === "/api/orders/place" && method === "POST") {
    return placeOrder(req, res);
  }

  // 获取订单详情
  if (path.match(/^\/api\/orders\/\d+$/) && method === "GET") {
    const id = path.split("/").pop();
    return getOrderById(id, res);
  }

  // 审批订单
  if (path.includes("/approve") && method === "POST") {
    const id = path.split("/")[2];
    return approveOrder(id, req, res);
  }

  // 拒绝订单
  if (path.includes("/reject") && method === "POST") {
    const id = path.split("/")[2];
    return rejectOrder(id, req, res);
  }

  // ========== 其他 API ==========

  // 客服支持
  if (path === "/api/information/support") {
    return res.status(200).json(getsupport());
  }

  // 404 - 未找到
  res.status(404).json({ error: `API ${path} 未找到` });
}

// ========== 数据函数 ==========

// 商品数据库
const allProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 7999,
    category: "手机",
    image: "/images/iphone15pro.jpg",
    description: "A17 Pro芯片",
  },
  {
    id: 2,
    name: "MacBook Pro 14",
    price: 12999,
    category: "电脑",
    image: "/images/macbook.jpg",
    description: "M3 Pro芯片",
  },
  {
    id: 3,
    name: "iPad Air",
    price: 3999,
    category: "平板",
    image: "/images/ipad.jpg",
    description: "M1芯片",
  },
  {
    id: 4,
    name: "iPhone 15",
    price: 5999,
    category: "手机",
    image: "/images/iphone15.jpg",
    description: "灵动岛设计",
  },
  {
    id: 5,
    name: "MacBook Air",
    price: 8999,
    category: "电脑",
    image: "/images/macbookair.jpg",
    description: "轻薄便携",
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
  {
    id: 9,
    name: "Apple Watch Series 9",
    price: 2999,
    category: "其他",
    image: "/images/watch.jpg",
    description: "智能手表",
  },
  {
    id: 10,
    name: "AirPods Pro 2",
    price: 1899,
    category: "其他",
    image: "/images/airpods.jpg",
    description: "降噪耳机",
  },
];

function getProducts(keyword) {
  if (keyword) {
    return allProducts.filter((p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase()),
    );
  }
  return allProducts;
}

function getProductById(id) {
  return allProducts.find((p) => p.id === parseInt(id));
}

function getOffers() {
  return allProducts.slice(0, 3).map((p) => ({
    ...p,
    originalPrice: Math.round(p.price * 1.15),
    discount: 15,
  }));
}

function getNewArrivals() {
  return allProducts.slice(0, 2).map((p) => ({ ...p, isNew: true }));
}

function getProductsByCategory(category) {
  return allProducts.filter((p) => p.category === category);
}

// 购物车数据（内存存储，重启后丢失）
let cart = [];

function getCart() {
  return cart;
}

function addToCart(req, res) {
  const { productId, name, price, qty = 1 } = req.body;

  if (!productId || !name) {
    return res.status(400).json({ error: "缺少必要字段" });
  }

  const newItem = {
    id: Date.now(),
    productId,
    name,
    price,
    qty,
    addedAt: new Date().toISOString(),
  };

  cart.push(newItem);
  return res
    .status(201)
    .json({ success: true, message: "添加成功", data: newItem });
}

function removeFromCart(id, res) {
  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "商品不存在" });
  }
  cart.splice(itemIndex, 1);
  return res.status(200).json({ success: true, message: "删除成功" });
}

function clearCart(res) {
  cart = [];
  return res.status(200).json({ success: true, message: "购物车已清空" });
}

function getFakeCart() {
  return [
    { id: 1, productId: 1, name: "iPhone 15 Pro", price: 7999, qty: 1 },
    { id: 2, productId: 4, name: "iPhone 15", price: 5999, qty: 2 },
  ];
}

// 订单数据
let orders = [];

function placeOrder(req, res) {
  const { name, address, extraAddress, selectedPayment, items, totalAmount } =
    req.body;

  if (!name || !address || !selectedPayment) {
    return res.status(400).json({ error: "请填写所有必填信息" });
  }

  const newOrder = {
    id: orders.length + 1,
    orderNumber: `ORD${Date.now()}`,
    customerName: name,
    address: `${address} ${extraAddress || ""}`,
    paymentMethod: selectedPayment,
    items: items || [],
    totalAmount: totalAmount || 0,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);

  // 根据支付方式返回不同的支付链接
  let paymentUri = "";
  if (selectedPayment === "alipay") {
    paymentUri = "https://qr.alipay.com/pay";
  } else if (selectedPayment === "wechat") {
    paymentUri = "https://qr.wechat.com/pay";
  }

  return res.status(201).json({
    id: newOrder.id,
    paymentUri: paymentUri,
    message: "订单创建成功",
  });
}

function getOrderById(id, res) {
  const order = orders.find((o) => o.id === parseInt(id));
  if (order) {
    return res.status(200).json(order);
  }
  return res.status(404).json({ error: "订单不存在" });
}

function approveOrder(id, req, res) {
  const order = orders.find((o) => o.id === parseInt(id));
  if (order) {
    order.status = "approved";
    return res.status(200).json({ message: `订单 ${id} 已批准`, order });
  }
  return res.status(404).json({ error: "订单不存在" });
}

function rejectOrder(id, req, res) {
  const order = orders.find((o) => o.id === parseInt(id));
  if (order) {
    order.status = "rejected";
    return res.status(200).json({ message: `订单 ${id} 已拒绝`, order });
  }
  return res.status(404).json({ error: "订单不存在" });
}

function getsupport() {
  return {
    phone: "400-666-8800",
    email: "support@blackapple.com",
    workingHours: "周一至周日 9:00-21:00",
    address: "北京市朝阳区xxx科技园",
  };
}
