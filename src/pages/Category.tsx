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

// 清洗URL函数，打印调试前后值
const fixAssetUrl = (url: string) => {
  const oldPrefix = "http://152.136.182.210:12231";
  const resultUrl = url.replace(oldPrefix, "");
  console.log("URL替换对比：", url, "→", resultUrl);
  return resultUrl;
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

  // 批量清洗所有资源路径
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

  // 挂载后打印最终传给子组件的地址，用来排查
  useEffect(() => {
    console.log("=== 最终传给子组件的干净路径 ===");
    console.log("视频smallSrc：", fixedData.videos.smallSrc);
    console.log("第一张特性图：", fixedData.features[0]?.img);
    console.log("第一个产品图：", fixedData.products[0]?.image);
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
