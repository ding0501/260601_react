import { Product } from "@/types/custom";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import React from "react";

interface SearchResultCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const SearchResultCard = ({ product, onAddToCart }: SearchResultCardProps) => {
  const navigate = useNavigate();

  console.log(`SearchResultCard 组件渲染， 产品${product.name}`);

  return (
    <div
      key={product.id}
      className="bg-gray-50 dark:bg-gray-900
            rounded-2xl shadow-sm p-6
            hover:transform hover:scale-105 transition-all duration-300
            border border-gray-100 dark:border-gray-700"
    >
      <div className="aspect-square object-contain rounded-xl">
        <img
          className="w-full h-full object-contain rounded-xl"
          src={product.image}
          alt={product.image}
        />
      </div>
      <h3 className="text-2xl font-semibold mt-2 text-gray-900 dark:text-white">
        {product.name}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{product.title}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-medium text-gray-900 dark:text-white">
          {product.startingPrice}
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
