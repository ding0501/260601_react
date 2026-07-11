import DocumentViewer from "../components/DocumentViewer";
import { NEW_ARRIVALS_LIST_3 } from "../assets/data/index";
import ProductIntro from "../components/ProductIntro";
import { useTranslation } from "react-i18next";

function AutoCAD() {
  const { t } = useTranslation();
  
  return (
    <div>
      <ProductIntro/>
      {/* 直接渲染 DocumentViewer，绕过 ProductList */}
      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          justifyItems: "center",
          rowGap: "1.5rem",
        }}
      >
        {NEW_ARRIVALS_LIST_3.map((item, index) => (
          <DocumentViewer
            key={index} // 使用 index 作为 key 更可靠
            title={item.title}
            imageUrl={item.image}
            pdfUrl={item.document}
            textColor={item.textColor}
            index={index} // 传入 index 用于自动编号
          />
        ))}
      </div>
    </div>
  );
}

export default AutoCAD;