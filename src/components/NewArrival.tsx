import styles from "./Product.module.css";
import styled from "styled-components";

type StyledProductTextContainerProps = {
  $textColor?: string;
};
const StyledProductTextContainer = styled.div<StyledProductTextContainerProps>`
  position: absolute;
  top: 1.5rem;
  padding-left: 1.5rem;
  padding-top: 2rem;
  color: ${(props) => props.$textColor || "white"};
  font-family: "Roboto", "Helvetia", "Arial", sans-serif;
`;

//transform: scale(1.05)表示：鼠标悬停时放大5%
//trasition: transform 0.3s ease-in-out表示：动画特效三秒，先加速再减速
//trasition: transform ${(props) => props.transition || "0.1s"} ease-in-out;默认是0.1s 通过props可以做到修改动画特效时间,下面改为transition="0.5s"0.5s

type StyledProductContainerProps = {
  $transition?: string;
  $scale?: number;
};
const StyledProductContainer = styled.div<StyledProductContainerProps>`
  max-width: 28rem;
  position: relative;
  transition: transform ${(props) => props.$transition || "0.1s"} ease-in-out;

  &:hover {
    transform: scale(${(props) => props.$scale || 1});
    cursor: pointer;
  }
`;

export type NewArrivalProps = {
  image: string;
  title: string;
  detail: string;
  textColor?: string;
  scale?: number;
  onProductClick: (title: string) => void;
};
function NewArrival({
  image,
  title,
  detail,
  textColor,
  scale = 1.05,
  onProductClick,
}: NewArrivalProps) {
  const imgStyle = {
    height: "auto",
    width: "100%",
    borderRadius: "0.5rem",
  };
  return (
    <StyledProductContainer
      $scale={scale}
      $transition="0.5s"
      onClick={() => onProductClick(title)}
    >
      <img style={imgStyle} src={image} alt="iPad Pro" />
      <StyledProductTextContainer $textColor={textColor}>
        <div className={styles["product-title"]}>{title}</div>
        <div className={styles["product-detail"]}>{detail}</div>
      </StyledProductTextContainer>
    </StyledProductContainer>
  );
}
export default NewArrival;
