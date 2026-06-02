import styles from "./Offer.module.css";

export interface OfferProps {
  type: string;
  title: string;
  detail: string;
  image: string;
}
function Offer({ type, title, detail, image }: OfferProps) {
  // const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
  //   alert("Offer clicked");
  // };
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e.target);
    console.log(e.currentTarget);

    alert("Offer clicked" + e.currentTarget.dataset.title);
  };
  return (
    <div className={styles.container} onClick={handleClick} data-title={title}>
      <img src={image} className={styles.image} />
      <div className={styles.content}>
        <div className={styles.type}>{type}</div>
        <div className={styles.title}>{title}</div>
        <div className={styles.detail}>{detail}</div>
      </div>
    </div>
  );
}

export default Offer;
