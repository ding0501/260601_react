// 获取 API 基础 URL
export const getApiBaseUrl = () => {
  // 开发环境使用完整 URL
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_BASE_URL || "https://152.136.182.210:12231";
  }
  // 生产环境使用相对路径
  return "";
};

// 获取完整 API URL
export const getApiUrl = (path) => {
  const baseUrl = getApiBaseUrl();
  // 确保 path 以 / 开头
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};
