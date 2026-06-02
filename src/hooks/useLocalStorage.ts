import { useState, useEffect } from "react";

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const savedValue = localStorage.getItem(key);
      if (!savedValue) return initialValue;

      const parsed = JSON.parse(savedValue);

      // 如果是数组类型，确保返回数组
      if (Array.isArray(initialValue)) {
        return Array.isArray(parsed) ? parsed : initialValue;
      }

      return parsed ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};

export default useLocalStorage;
