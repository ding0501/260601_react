import DocumentViewer from "../components/DocumentViewer";
import { NEW_ARRIVALS_LIST_3 } from "../assets/data/index";
import ProductIntro from "../components/ProductIntro";
// 删除这一行：import ProductList from "@components/ProductList";
// 如果不需要 useTranslation，也可以删除这行
import { useTranslation } from "react-i18next";

function AutoCAD() {
  const { t } = useTranslation();
  
  return (
    <div>
      <ProductIntro/>
      {/* 直接渲染 DocumentViewer，绕过 ProductList */}
      <div
        style={{
          marginTop: "1rem", // 从 4rem 缩小到 1rem
          display: "grid",
          justifyItems: "center",
          rowGap: "1.5rem", // 从 3rem 缩小到 1.5rem
        }}
      >
        {NEW_ARRIVALS_LIST_3.map((item) => (
          <DocumentViewer
            key={item.title}
            title={item.title}
            imageUrl={item.image}
            pdfUrl={item.document}
            textColor={item.textColor}
          />
        ))}
      </div>
    </div>
  );
}

export default AutoCAD;