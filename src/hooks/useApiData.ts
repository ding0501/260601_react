import { useState, useEffect, useRef } from "react";

interface UseApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  autoFetch?: boolean; //是否在 mount 时自动请求
}

type ExtraOptions = {
  overrideUrl?: string;
  overrideMethod?: "GET" | "POST" | "PUT" | "DELETE";
  overrideHeaders?: Record<string, string>;
  overrideBody?: any;
};

const useApiData = <T>(apiUrl: string, options: UseApiOptions = {}) => {
  const {
    method = "GET",
    body = null,
    headers = {},
    autoFetch = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = async (extraOptions: ExtraOptions = {}) => {
    try {
      setLoading(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch(extraOptions?.overrideUrl || apiUrl, {
        method: extraOptions?.overrideMethod || method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
          ...extraOptions?.overrideHeaders,
        },
        body:
          (extraOptions?.overrideMethod || method) !== "GET"
            ? JSON.stringify(extraOptions?.overrideBody || body)
            : undefined,
        signal: controller.signal,
      });
      //如果返回 401 ，拦截并处理
      if (response.status === 401) {
        console.warn("未授权,清空token 并跳转登录");
        localStorage.removeItem("token");
        window.location.href = "/auth/signin";
        return;
      }

      const result: T = await response.json();
      if (!response.ok) {
        throw new Error("网络错误");
      }
      console.log("加载数据：", result);
      setData(result);
      setError(null);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("加载数据失败：", error);
        setError(error instanceof Error ? error.message : "加载数据失败");
        setData(null);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  useEffect(() => {
    if (!autoFetch) return;

    fetchData();
    return () => {
      console.log("useEffect 清理");
    };
  }, [apiUrl]);
  return {
    data,
    loading,
    error,
    fetchData,
  };
};
export default useApiData;
