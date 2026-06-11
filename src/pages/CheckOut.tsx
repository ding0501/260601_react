import { useEffect, useState, useContext } from "react";
import SquareInput from "../components/SquareInput";
import PaymentSelector from "../components/PaymentSelector";
import { SiAlipay, SiWechat } from "react-icons/si";
import Button from "../components/Button";
import useApiData from "@/hooks/useApiData";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Order } from "../types/custom";
import { ShoppingCartContext } from "@/contexts/shoppingCart";

const CheckOut = () => {
  const { clearCart } = useContext(ShoppingCartContext);
  const { token } = useSelector((s: RootState) => s.user);
  const { data, loading, error, fetchData } = useApiData<Order>(
    "http://152.136.182.210:12231/api/orders/place",
    {
      method: "POST",
      autoFetch: false,
    },
  );
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [extraAddress, setExtraAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");

  const handleSubmit = async () => {
    if (!name || !address || !phoneNumber || !selectedPayment) {
      alert("请填写所有必填信息！");
      return;
    }
    const body = {
      name,
      address,
      extraAddress,
      selectedPayment,
    };
    console.log("提交的订单信息：", body);
    try {
      await fetchData({
        overrideBody: body,
        overrideHeaders: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("返回的数据：", data);
      alert("订单已提交");
    } catch (error) {
      console.error("返回的数据：", error);
      alert("订单提交失败");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (error) alert(error);
    if (data) {
      //清空购物车
      clearCart();
      const { id, paymentUri } = data;
      window.location.href = `${paymentUri}?orderId=${id}&redirect=http://localhost:3000/orders/${id}`;
    }
  }, [data, loading, error]);
  return (
    <div className="min-h-screen pt-6 p-4">
      <p className="text-4xl mt-3">你的送货地址是哪里？</p>
      <div className="flex flex-col gap-6 mt-12">
        <p className="text-2xl">输入收件人的姓名和地址：</p>
        <SquareInput
          subTitle="姓名"
          title="请输入姓名"
          value={name}
          onChange={setName}
        />
        <SquareInput
          subTitle="收货地址"
          title="请输入你的地址"
          value={address}
          onChange={setAddress}
        />
        <SquareInput
          subTitle=""
          title="附加详细地址"
          value={extraAddress}
          onChange={setExtraAddress}
        />
        <p className="text-2xl">你的联系方式是什么？</p>
        <SquareInput
          subTitle="电话号码"
          title="请输入你的电话号码"
          value={phoneNumber}
          onChange={setPhoneNumber}
        />
        <p className="text-3xl mt-6">选择你的支付方式</p>
        <div className="flex flex-col gap-4 mt-6">
          <PaymentSelector
            name="支付宝"
            icon={<SiAlipay className="w-6 h-6 text-blue-500" />}
            isSelected={selectedPayment === "alipay"}
            onClick={() => setSelectedPayment("alipay")}
          />
          <PaymentSelector
            name="微信"
            icon={<SiWechat className="w-6 h-6 text-green-500" />}
            isSelected={selectedPayment === "wechat"}
            onClick={() => setSelectedPayment("wechat")}
          />
        </div>
        <div className="flex justify-end mt-12 mr-4">
          <Button title="下单" onClick={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};
export default CheckOut;
