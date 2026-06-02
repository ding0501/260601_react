import styles from "./withSoldOut.module.css";
function withSoldOut(WarppedComponent) {
  return ({ soldOut, ...props }) => {
    return soldOut ? (
      <div className={styles.greayOverlay}>
        <WarppedComponent {...props} />
      </div>
    ) : (
      <WarppedComponent {...props} />
    );
  };
}
export default withSoldOut;
