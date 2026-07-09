//主程序
import { NEW_ARRIVALS_LIST, OFFER_LIST } from "../assets/data"; //引入数据文件
import ProductList from "@components/ProductList";
import NewArrival, { type NewArrivalProps } from "@components/NewArrival";
import Offer from "@components/Offer";
import withSoldOut from "../HOCs/withSoldOut";
import withBanner from "../HOCs/withBanner";
import ImageHero from "../components/ImageHero";
import { SUGGESTED_PROUDCT } from "../assets/data";
import ProductHero from "../components/ProductHero";
import { useTranslation } from "react-i18next";

const NewArrivalWithSoldOutCheck = withSoldOut((props: NewArrivalProps) => {
  const { title } = props;
  return <NewArrival {...props} title={"商品" + title} />;
});
const NewArrivalWithBannerAndSoldOutCheck = withBanner(
  NewArrivalWithSoldOutCheck,
  "手慢无！",
); //使用 HOC 添加Banner
const OfferWithSoldOutCheck = withSoldOut(Offer);

function Home() {
  const { t } = useTranslation();
  return (
    <div>
      <ImageHero />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-8 md:px-12 md:py-10">
  <div className="max-w-5xl w-full">
    <div className="relative inline-block w-full">
      {/* 添加边框和背景的容器 */}
      <div className="
        w-full 
        rounded-2xl 
        border-2 
        border-cyan-400/40 
        bg-gradient-to-br 
        from-slate-900/90 
        via-slate-800/80 
        to-slate-900/90 
        backdrop-blur-sm 
        p-6 
        md:p-10 
        shadow-2xl 
        shadow-cyan-500/20 
        hover:shadow-cyan-500/40 
        transition-shadow 
        duration-300
      ">
        <h1 className="
          relative 
          text-2xl 
          md:text-4xl 
          font-bold 
          leading-relaxed 
          bg-gradient-to-r 
          from-cyan-400 
          via-blue-500 
          to-purple-600 
          bg-clip-text 
          text-transparent
          drop-shadow-lg
        "
        style={{
          backgroundSize: '200% auto',
          animation: 'gradient 3s ease-in-out infinite'
        }}>
          此网页是个人练习前端的一个练习项目，与Apple无关联。
        </h1>
      </div>
    </div>
  </div>
</div>
      
       
      <ProductHero
        product={SUGGESTED_PROUDCT.product}
        imageUrl={SUGGESTED_PROUDCT.imageSrc}
      />

      <ProductList
        title={t(`home_page.newarrivals`)}
        datalength={NEW_ARRIVALS_LIST.length}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
          {NEW_ARRIVALS_LIST.map((item) => (
            <NewArrivalWithBannerAndSoldOutCheck
              key={item.title}
              {...item}
              scale={1.05}
            />
          ))}
        </div>
      </ProductList>

      <ProductList title={t(`home_page.offers`)} datalength={OFFER_LIST.length}>
        {OFFER_LIST.map((item) => (
          <OfferWithSoldOutCheck key={item.title} {...item} scale={1.05} />
        ))}
      </ProductList>
    </div>
  );
}
export default Home;
