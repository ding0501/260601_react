import { Product } from "@/types/custom";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import React, { useMemo } from "react";

interface SearchResultCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const SearchResultCard = ({ product, onAddToCart }: SearchResultCardProps) => {
  const navigate = useNavigate();

  // 直接使用原始路径，不做任何处理，先看看到底是什么
  const imageUrl = product.image;

  console.log("图片原始路径:", imageUrl);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    console.error("图片加载失败 URL:", e.currentTarget.src);
    // 临时显示文本而不是图片，方便调试
    e.currentTarget.style.display = "none";
  };

  return (
    <div
      key={product.id}
      className="bg-gray-50 dark:bg-gray-900
            rounded-2xl shadow-sm p-6
            hover:transform hover:scale-105 transition-all duration-300
            border border-gray-100 dark:border-gray-700"
    >
      <div className="aspect-square object-contain rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <img
          className="w-full h-full object-contain rounded-xl"
          src={imageUrl}
          alt={product.name}
          onError={handleImageError}
        />
        {/* 调试信息：显示图片路径 */}
        <div className="absolute text-xs text-gray-500 bg-white bg-opacity-75 p-1 rounded">
          {imageUrl}
        </div>
      </div>
      <h3 className="text-2xl font-semibold mt-2 text-gray-900 dark:text-white">
        {product.name}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{product.title}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-medium text-gray-900 dark:text-white">
          ¥{product.startingPrice}
        </span>
        <div className="flex gap-3">
          <Button
            title="立刻购买"
            onClick={() => onAddToCart && onAddToCart(product)}
          />
          <Button
            title="了解更多"
            variant="outline"
            onClick={() => navigate(`/product-detail/${product.id}`)}
          />
        </div>
      </div>
      {!product.inStock && (
        <div className="mt-4 text-red-500 dark:text-red-400">暂时缺货</div>
      )}
    </div>
  );
};

const SearchResultCardComponent = React.memo(SearchResultCard);
export default SearchResultCardComponent;
