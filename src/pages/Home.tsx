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
import Disclaimer from "../components/Disclaimer";
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
      <Disclaimer/>
      
       
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
