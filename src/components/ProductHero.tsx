import SkuSelect from "./SkuSelect";
import { useState, useContext } from "react";
import { produce } from "immer";
import { Product, CartItem } from "@/types/custom";
import { ShoppingCartContext } from "../contexts/shoppingCart";
import { useTranslation } from "react-i18next";

const updateItem = (updates: Partial<CartItem>) => {
  return produce((draft) => {
    Object.assign(draft, updates);
  });
};

type ProductHeroProps = {
  product: Product;
  imageUrl: string;
};

function ProductHero({ product, imageUrl }: ProductHeroProps) {
  const { addToCart } = useContext(ShoppingCartContext);
  const { t } = useTranslation();
  const [cartItem, setCartItem] = useState<CartItem>({
    id: Date.now(),
    productId: product.id,
    name: product.name,
    imageSrc: product.image,
    modelId: null,
    modelPrice: null,
    model: null,
    color: null,
    memorySize: null,
    memorySizeId: null,
    memorySizePrice: null,
    qty: 1,
  });

  const handleAddToCart = () => {
    if (
      !cartItem.model ||
      !cartItem.color ||
      !cartItem.memorySize ||
      !cartItem.modelId ||
      !cartItem.memorySizeId
    ) {
      alert("请先选择型号、颜色和储存容量");
      return;
    }
    addToCart(cartItem);
    console.log("已加入购物车:", cartItem);
  };

  return (
    <div
      className="flex flex-col lg:flex-row-reverse
        pt-8 mt-4 
        md:pt-28 lg:pt-52
        space-y-4
        text-apple-text-light dark:text-apple-text-dark
    "
    >
      <div className="flex-1 flex justify-center items-center">
        <img src={imageUrl} alt="" className="w-[350px] lg:-mt-32 lg:ml-19" />
      </div>
      <div className="flex-1 space-y-6 ml-6 md:ml-24">
        <div className="text-4xl font-black md:text-6xl">
          {t(`home_page.product_hero.title`)}
        </div>
        <div className="font-medium md:text-xl">
          RMB {Number(product.startingPrice).toLocaleString("en-US")}
        </div>
        <div className="flex space-x-3">
          <SkuSelect
            placeholder={t(`home_page.product_hero.model`)}
            options={product.models.map((model) => model.name)}
            onChange={(value) => {
              const selectedModel = product.models.find(
                (model) => model.name === value,
              );
              if (selectedModel)
                setCartItem(
                  updateItem({
                    model: selectedModel.name,
                    modelId: selectedModel.id,
                    modelPrice: selectedModel.price,
                  }),
                );
              console.log(cartItem);
            }}
            value={cartItem.model}
          />
          <SkuSelect
            placeholder={t(`home_page.product_hero.color`)}
            options={product.colors}
            onChange={(value) => {
              setCartItem(updateItem({ color: value as string })); // 确保类型安全
            }}
            value={cartItem.color}
          />
          <SkuSelect
            placeholder={t(`home_page.product_hero.memory`)}
            options={product.memorySizes.map((size) => size.name)}
            onChange={(value) => {
              const selectedMemorySize = product.memorySizes.find(
                (size) => size.name === value,
              );
              if (selectedMemorySize)
                setCartItem(
                  updateItem({
                    memorySize: selectedMemorySize.name,
                    memorySizeId: selectedMemorySize.id,
                    memorySizePrice: selectedMemorySize.price,
                  }),
                );
            }}
            value={cartItem.memorySize}
          />
          <button
            className="
            border border-apple-blue
            px-5 py-2 bg-transparent
            rounded-md
            hover:bg-apple-blue
            hover:text-apple-gray-100
          "
            onClick={() => {
              handleAddToCart();
            }}
          >
            {t(`home_page.product_hero.add_cart`)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductHero;
