import { useParams } from "react-router-dom";
import useApiData from "@/hooks/useApiData";
import { Category as CategoryType } from "@/types/custom";
import { Skeleton } from "@/components/Skeleton";
import VideoHero from "@/components/VideoHero";
import TextHeader from "@/components/TextHeader";
import ImageSlider from "@/components/ImageSlider";
import CompareTable from "@/components/CompareTable";
import useApiWithReducer from "@/hooks/useApiWithReducer";

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
  } = useApiWithReducer<CategoryType>(
    `http://152.136.182.210:12231/api/categories/${category}`,
  );

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
      {/* 视频展示 */}
      <VideoHero
        videoSrc={productCategory!.videos.regularSrc}
        videoSmallSrc={productCategory!.videos.smallSrc}
      />
      {/* 走马灯 */}
      <ImageSlider features={productCategory!.features} />
      {/* 系列产品比较 table */}
      <CompareTable products={productCategory!.products} />
    </div>
  );
};
export default Category;
