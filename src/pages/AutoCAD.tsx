import DocumentViewer from "../components/DocumentViewer";
import { NEW_ARRIVALS_LIST_3 } from "../assets/data";
import ProductList from "@components/ProductList";
import { useTranslation } from "react-i18next";

function AutoCAD() {
  const { t } = useTranslation();
  
  return (
    <ProductList title={t("autoCAD.documents")} datalength={NEW_ARRIVALS_LIST_3.length}>
      {NEW_ARRIVALS_LIST_3.map((item) => (
        <DocumentViewer
          key={item.title}
          title={item.title}
          imageUrl={item.image}
          pdfUrl={item.document}
          textColor={item.textColor}
        />
      ))}
    </ProductList>
  );
}

export default AutoCAD;