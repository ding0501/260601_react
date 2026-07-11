import VideoViewer from "../components/VideoViewer";
import ProductIntroduce from "../components/ProductIntroduce";
import { NEW_ARRIVALS_LIST_4 } from "../assets/data";
import { useTranslation } from "react-i18next";

const SolidWorks = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen text-apple-text dark:text-apple-text-dark">
  
      <ProductIntroduce/>
      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          justifyItems: "center",
          rowGap: "1.5rem",
        }}
      >
        {NEW_ARRIVALS_LIST_4.map((item, index) => (
          <VideoViewer
            key={index} // 使用 index 作为 key 更可靠
            title={item.title}
            videoUrl={item.video}
            pdfUrl={item.document}
            imageUrl={item.image}
            textColor={item.textColor}
            showBorder={true}
            autoPlay={true}
            index={index} // 传入 index 用于自动编号
          />
        ))}
      </div>
    </div>
  );
};

export default SolidWorks;