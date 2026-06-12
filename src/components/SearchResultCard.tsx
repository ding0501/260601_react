import { Product } from "@/types/custom";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import React, { useMemo } from "react";

interface SearchResultCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  if (imagePath.startsWith("//")) {
    return `https:${imagePath}`;
  }

  if (import.meta.env.DEV) {
    return `http://152.136.182.210:12231${imagePath}`;
  }

  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || "";
  return `${baseUrl}${imagePath}`;
};

const SearchResultCard = ({ product, onAddToCart }: SearchResultCardProps) => {
  const navigate = useNavigate();
  const imageUrl = useMemo(() => getImageUrl(product.image), [product.image]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src =
      "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image";
  };

  return (
    <div
      key={product.id}
      className="bg-gray-50 dark:bg-gray-900
            rounded-2xl shadow-sm p-6
            hover:transform hover:scale-105 transition-all duration-300
            border border-gray-100 dark:border-gray-700"
    >
      <div className="aspect-square object-contain rounded-xl bg-gray-100 dark:bg-gray-800">
        <img
          className="w-full h-full object-contain rounded-xl"
          src={imageUrl}
          alt={product.name}
          onError={handleImageError}
          loading="lazy"
        />
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
