import { useParams } from "react-router-dom";
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

// ========== 新增：URL修复函数，干掉http://152.136.182.210:12231前缀 ==========
const fixAssetUrl = (url: string) => {
  const oldPrefix = "http://152.136.182.210:12231";
  return url.replace(oldPrefix, "");
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

  // ========== 新增：批量把接口返回的所有图片/视频地址转成相对路径 ==========
  const fixedData = {
    ...productCategory,
    // 修正视频地址
    videos: {
      regularSrc: fixAssetUrl(productCategory.videos.regularSrc),
      smallSrc: fixAssetUrl(productCategory.videos.smallSrc),
    },
    // 修正轮播里每张特性图片
    features: productCategory.features.map((item) => ({
      ...item,
      img: fixAssetUrl(item.img),
    })),
    // 修正对比表格里每个产品图
    products: productCategory.products.map((prod) => ({
      ...prod,
      image: fixAssetUrl(prod.image),
    })),
  };

  // ========== 渲染全部用修复后的 fixedData，不再直接用原始productCategory ==========
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
