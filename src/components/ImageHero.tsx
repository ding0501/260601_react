import hero_small_image from "../assets/images/hero_small.jpg";
import hero_image from "../assets/images/hero.jpg";
import IconButton from "./IconButton";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdOutlineNavigateNext } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ImageHero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function sleepASync(milliseconds: number) {
    // const start = Date.now();
    // while (Date.now() - start < milliseconds) {
    //   //空转，占用CPU，阻塞后继续代码执行
    // }
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
  const fakeFetchData = () => {
    sleepASync(10000).then(() => {
      console.log("数据获取完成");
      navigate("/product-detail/1");
    }); //阻塞10秒
    console.log("数据获取完成");
  };
  return (
    <div className="relative bg-black text-white mb-2">
      <img
        src={hero_small_image}
        className="w-full h-\[480px\] object-cover block md:hidden"
      />
      <img
        src={hero_image}
        className="w-full h-\[480px\] object-cover hidden md:block"
      />
      <div className="absolute inset-4 flex flex-col p-2 items-center justify-end text-center md:justify-start">
        <div className="text-4xl md:text-6xl font-bold">
          {t(`home_page.image_hero.product_name`)}
        </div>
        <div className="mt-4 flex space-x-4">
          <IconButton
            icon={<MdOutlineNavigateNext />}
            ioconPosition="right"
            title={t(`home_page.image_hero.learn_more`)}
            variant="primary"
            onClick={() => {
              fakeFetchData(); //模拟数据获取
            }}
          />
          <IconButton
            icon={<AiOutlineShoppingCart />}
            title={t(`home_page.image_hero.buy`)}
            variant="outline"
          />
          {/* <button className="px-6 py-2 border border-blue-600 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            进一步了解
          </button>
          <button className="px-6 py-2 border border-blue-600 bg-transparent text-white rounded-md hover:bg-blue-700 transition">
            购买
          </button> */}
        </div>
      </div>
    </div>
  );
};
export default ImageHero;
