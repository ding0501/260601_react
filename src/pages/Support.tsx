import { useEffect, useState } from "react";
import { Skeleton } from "@/components/Skeleton";
import { SupportData } from "../types/custom";
import useApiData from "@/hooks/useApiData";

const Support = () => {
  const { data, loading, error } = useApiData<SupportData>(
    "//152.136.182.210:12231/api/information/support",
  );

  // 将外部 HTTP 图片链接替换为本地 HTTPS 链接
  const replaceImageUrls = (html: string) => {
    if (!html) return "";

    // 替换 mac 目录下的图片
    let fixedHtml = html.replace(
      /http:\/\/152\.136\.182\.210:12231\/images\/mac\//g,
      "/images/mac/",
    );

    // 如果还有其他目录的图片，继续添加替换规则
    fixedHtml = fixedHtml.replace(
      /http:\/\/152\.136\.182\.210:12231\/images\//g,
      "/images/",
    );

    return fixedHtml;
  };

  if (loading) {
    return <Skeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>加载数据失败：{error}</p>
      </div>
    );
  }

  const fixedHtml = replaceImageUrls(data?.data || "");

  return (
    <div className="min-h-screen text-apple-text dark:text-apple-text-dark">
      <div
        className="p-4 text-xs text-gray-500"
        dangerouslySetInnerHTML={{ __html: fixedHtml }}
      ></div>
    </div>
  );
};

export default Support;
