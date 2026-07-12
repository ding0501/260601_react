import VideoViewerFit from "../components/VideoViewerFit";
import { NEW_ARRIVALS_LIST_2 } from "../assets/data";
import { useTranslation } from "react-i18next";

const SolidWorksFit = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen text-apple-text dark:text-apple-text-dark">
      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          justifyItems: "center",
          rowGap: "1.5rem",
        }}
      >
        {NEW_ARRIVALS_LIST_2.map((item, index) => (
          <VideoViewerFit
            key={index}
            title={item.title}
            video_1={item.video_1}    // 右侧循环播放 - 装配体旋转
            video_2={item.video_2}    // 左侧循环播放 - 装配体爆炸动画
            textColor={item.textColor}
            showBorder={true}
            autoPlay={true}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default SolidWorksFit;