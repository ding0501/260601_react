import { useEffect, useState } from "react";
import { Skeleton } from "@/components/Skeleton";
import { SupportData } from "../types/custom";
import useApiData from "@/hooks/useApiData";
import { getApiUrl } from "@/utils/url";

const Support = () => {
  // 使用 getApiUrl 函数，不要硬编码 HTTP 地址
  const { data, loading, error } = useApiData<SupportData>(
    getApiUrl("/api/information/support"),
  );

  if (loading) {
    return <Skeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>加载数据失败：{error.message || error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-apple-text dark:text-apple-text-dark">
      <div
        className="p-4 text-xs text-gray-500"
        dangerouslySetInnerHTML={{ __html: data?.data || "" }}
      ></div>
    </div>
  );
};

export default Support;
