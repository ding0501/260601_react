interface ProductTitleProps {
  name: string;
  startingPrice: number;
  installment?: number;
}

const ProductTitle = ({
  name,
  startingPrice,
  installment,
}: ProductTitleProps) => {
  return (
    <div>
      <p className="text-apple-red tex-sm font-semibold">全新</p>
      <h4 className="text-4xl mt-2">购买 {name}</h4>
      <p className="mt-6">
        RMB{installment}/月起 或 RMB {startingPrice}起
      </p>
    </div>
  );
};
export default ProductTitle;
