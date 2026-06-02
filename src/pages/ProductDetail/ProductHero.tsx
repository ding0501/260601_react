import { div } from "framer-motion/client";

interface ProductTitleProps {
  imageSrc?: string;
}
const ProductHero = ({ imageSrc }: ProductTitleProps) => (
  <div className="w-full lg:w-2/3 h-[80vh] flex items-center justify-center">
    <img
      className="w-full h-full object-cover rounded-3xl"
      src={imageSrc}
      alt=""
    />
  </div>
);
export default ProductHero;
