export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.status(200).json({
    phone: "400-666-8800",
    email: "support@blackapple.com",
    workingHours: "周一至周日 9:00-21:00",
    address: "北京市朝阳区xxx科技园",
  });
}
