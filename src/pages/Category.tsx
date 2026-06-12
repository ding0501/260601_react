import { useParams, useEffect } from "react-router-dom";
import useApiWithReducer from "@/hooks/useApiWithReducer";
import { Category as CategoryType } from "@/types/custom";
import { Skeleton } from "@/components/Skeleton";
import VideoHero from "@/components/VideoHero";
import TextHeader from "@/components/TextHeader";
import ImageSlider from "@/components/ImageSlider";
import CompareTable from "@/components/CompareTable";

type CategoryParams = {
  category: string;
};

// 强制清洗并转为全站HTTPS绝对路径
const fixAssetUrl = (url: string) => {
  const httpPrefix = "http://152.136.182.210:12231";
  const siteHttpsDomain = "https://ding123.website";

  // 第一步移除后端http前缀
  let path = url.replace(httpPrefix, "");
  // 防止重复拼接域名
  if (!path.startsWith(siteHttpsDomain)) {
    path = `${siteHttpsDomain}${path}`;
  }

  console.log("URL转换记录：", url, "→", path);
  return path;
};

const Category = () => {
  const { category } = useParams<CategoryParams>();
  if (category == null) {
    throw new Error("Category not found");
  }

  const {
    data: productCategory,
    loading,
    error,
  } = useApiWithReducer<CategoryType>(
    `${import.meta.env.VITE_API_BASE}/api/categories/${category}`,
  );

  if (loading || !productCategory) {
    return <Skeleton />;
  }

  // 深度清洗所有资源地址
  const fixedData = {
    ...productCategory,
    videos: {
      regularSrc: fixAssetUrl(productCategory.videos.regularSrc),
      smallSrc: fixAssetUrl(productCategory.videos.smallSrc),
    },
    features: productCategory.features.map((item) => ({
      ...item,
      img: fixAssetUrl(item.img),
    })),
    products: productCategory.products.map((prod) => ({
      ...prod,
      image: fixAssetUrl(prod.image),
    })),
  };

  // 挂载打印最终传递给子组件的地址
  useEffect(() => {
    console.log("===== 最终传给子组件的HTTPS地址 =====");
    console.log("视频小地址：", fixedData.videos.smallSrc);
    console.log("第一张轮播图：", fixedData.features[0]?.img);
    console.log("第一个产品对比图：", fixedData.products[0]?.image);
  }, [fixedData]);

  return (
    <div className="min-h-screen">
      <TextHeader title={fixedData.title} subTitle={fixedData.subTitle} />
      <VideoHero
        videoSrc={fixedData.videos.regularSrc}
        videoSmallSrc={fixedData.videos.smallSrc}
      />
      <ImageSlider features={fixedData.features} />
      <CompareTable products={fixedData.products} />
    </div>
  );
};

export default Category;
