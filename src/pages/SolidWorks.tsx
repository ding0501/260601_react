
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
        {NEW_ARRIVALS_LIST_4.map((item) => (
          <VideoViewer
            key={item.title}
            title={item.title}
            videoUrl={item.video}
            pdfUrl={item.document}
            imageUrl={item.image}
            textColor={item.textColor}
            showBorder={true}
            autoPlay={true}
          />
        ))}
      </div>
    </div>
  );
};

export default SolidWorks;