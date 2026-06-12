import { useParams } from "react-router-dom";
import useApiData from "@/hooks/useApiData";
import { Category as CategoryType } from "@/types/custom";
import { Skeleton } from "@/components/Skeleton";
import VideoHero from "@/components/VideoHero";
import TextHeader from "@/components/TextHeader";
import ImageSlider from "@/components/ImageSlider";
import CompareTable from "@/components/CompareTable";
import useApiWithReducer from "@/hooks/useApiWithReducer";
import { getApiUrl } from "@/utils/url";

type CategoryParams = {
  category: string;
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
  } = useApiWithReducer<CategoryType>(getApiUrl(`/api/categories/${category}`));

  // 通用修复函数：移除 HTTP 域名，转成本地路径
  const fixUrl = (url: string) => {
    if (!url) return url;
    return url.replace("http://152.136.182.210:12231", "");
  };

  // 修复产品中的图片URL
  const fixedProducts = productCategory?.products?.map((product) => ({
    ...product,
    image: fixUrl(product.image),
    carouselImages: product.carouselImages?.map((img) => fixUrl(img)),
  }));

  // 修复 features 中的图片URL（ImageSlider 使用的数据）
  const fixedFeatures = productCategory?.features?.map((feature) => ({
    ...feature,
    image: fixUrl(feature.image),
  }));

  // 修复视频URL
  const fixedRegularSrc = fixUrl(productCategory?.videos?.regularSrc);
  const fixedSmallSrc = fixUrl(productCategory?.videos?.smallSrc);

  if (loading || !productCategory) {
    return <Skeleton />;
  }
  return (
    <div className="min-h-screen">
      {/* 标题 */}
      <TextHeader
        title={productCategory!.title}
        subTitle={productCategory!.subTitle}
      />
      {/* 视频展示 - 使用修复后的视频地址 */}
      <VideoHero videoSrc={fixedRegularSrc} videoSmallSrc={fixedSmallSrc} />
      {/* 走马灯 - 使用修复后的 features */}
      <ImageSlider features={fixedFeatures || productCategory!.features} />
      {/* 系列产品比较 table */}
      <CompareTable products={fixedProducts || productCategory!.products} />
    </div>
  );
};

export default Category;
