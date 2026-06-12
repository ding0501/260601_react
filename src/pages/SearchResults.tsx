import { useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { Product } from "@/types/custom";
import { useDebounce } from "@/helpers/useDebounce";
import Button from "@/components/Button";
import SearchResultCard from "@/components/SearchResultCard";
import { ShoppingCartContext } from "../contexts/shoppingCart";
import FilterButton from "@/components/FilterButton";
import { useSelector, useDispatch } from "react-redux";
import { RootState, StoreDispatch } from "../redux/store";
import { fetchSearchResults, clearSearch } from "../redux/searchSlice";

const filters = ["全部", "电脑", "手机", "平板", "其他"];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");
  const debouncedQuery = useDebounce(query, 500);

  const {
    items: searchResults,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch<StoreDispatch>();

  // 搜索逻辑
  useEffect(() => {
    if (!debouncedQuery) {
      dispatch(clearSearch());
      return;
    }
    const thunkPromise = dispatch(
      fetchSearchResults({ keyword: debouncedQuery }),
    );
    return () => {
      thunkPromise.abort();
    };
  }, [debouncedQuery, dispatch]);

  const { addToCart } = useContext(ShoppingCartContext);

  const handleAddToCart = useCallback(
    (product: Product) => {
      const cartItem = {
        productId: product.id,
        name: product.name,
        imageSrc: product.image,
        modelId: product.models[0]?.id ?? "",
        model: product.models[0]?.name ?? "",
        modelPrice: product.models[0]?.price ?? 0,
        memorySizeId: product.memorySizes[0]?.id ?? "",
        memorySize: product.memorySizes[0]?.name ?? "",
        memorySizePrice: product.memorySizes[0]?.price ?? 0,
        color: product.colors[0] ?? "",
        price:
          product.startingPrice +
          (product.models[0]?.price ?? 0) +
          (product.memorySizes[0]?.price ?? 0),
        qty: 1,
      };
      addToCart(cartItem);
    },
    [addToCart],
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("全部");

  const filteredProducts = useMemo(() => {
    if (!searchResults || searchResults.length === 0) {
      return [];
    }
    return searchResults.filter((product) => {
      const matchesCategory =
        selectedCategory === "全部" || product.category === selectedCategory;
      return matchesCategory;
    });
  }, [selectedCategory, searchResults]);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchParams({ query: newQuery });
  };

  // 重试搜索
  const handleRetry = () => {
    if (debouncedQuery) {
      dispatch(fetchSearchResults({ keyword: debouncedQuery }));
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-black">
      {/* 搜索输入框 */}
      <div className="max-w-4xl mx-auto mb-12">
        <input
          type="text"
          value={query ?? ""}
          onChange={handleInputChange}
          placeholder="输入搜索关键词"
          spellCheck={false}
          className="w-full px-6 py-4 bg-white dark:bg-gray-800 rounded-xl text-lg
          text-gray-900 dark:text-white
          border border-gray-200 dark:border-gray-700
          focus:outline-none focus:ring-1 focus:ring-blue-500
          transition-all"
        />
        <p className="mt-6 text-gray-700 dark:text-gray-300">
          搜索关键词：{query || "无"}
        </p>
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-3 text-gray-600 dark:text-gray-400">搜索中...</p>
          </div>
        </div>
      )}

      {/* 错误状态 */}
      {error && !isLoading && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400 text-lg mb-2">
              搜索失败
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              重新搜索
            </button>
          </div>
        </div>
      )}

      {/* 搜索结果统计 */}
      {!error && !isLoading && debouncedQuery && (
        <div className="max-w-4xl mx-auto mb-6">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            找到{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {filteredProducts.length}
            </span>{" "}
            个与“<span className="font-medium">{debouncedQuery}</span>
            ”相关的产品
          </p>
        </div>
      )}

      {/* 无搜索词提示 */}
      {!error && !isLoading && !debouncedQuery && (
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            输入关键词开始搜索
          </p>
        </div>
      )}

      {/* 分类筛选 */}
      {!error && !isLoading && filteredProducts.length > 0 && (
        <div className="max-w-4xl mx-auto mb-8 flex gap-4 flex-wrap">
          {filters.map((filter) => (
            <FilterButton
              key={filter}
              filter={filter}
              isSelected={filter === selectedCategory}
              onClick={() => setSelectedCategory(filter)}
            />
          ))}
        </div>
      )}

      {/* 搜索结果列表 */}
      {!error && !isLoading && filteredProducts.length > 0 && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProducts.map((product) => (
            <SearchResultCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* 无结果状态 */}
      {!error &&
        !isLoading &&
        debouncedQuery &&
        filteredProducts.length === 0 && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              未找到相关产品
            </p>
            <p className="text-gray-500 dark:text-gray-500">试试其他关键词吧</p>
          </div>
        )}
    </div>
  );
};

export default SearchResults;
