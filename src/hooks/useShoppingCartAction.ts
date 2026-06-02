import { Dispatch } from "react";
import {
  CartAction,
  addItem,
  removeItem,
  updateItem,
  clearCart,
  syncCart,
} from "@/reducers/shoppingCartReducer";
import { CartItem } from "@/types/custom";
import useApiData from "./useApiData";

const useShoppingCartAction = (dispatch: Dispatch<CartAction>) => {
  const { data, fetchData: callApi } = useApiData(
    "http://152.136.182.210:12231/api/ShoppingCart/items",
    {
      autoFetch: false,
    },
  );

  const jwt = localStorage.getItem("token");
  return {
    addToCart: async (item: CartItem) => {
      try {
        await callApi({
          overrideMethod: "POST",
          overrideHeaders: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
          overrideBody: JSON.stringify(item),
        });
        dispatch(addItem(item));
      } catch (error) {
        console.error("添加购物车失败：", error);
      }
    },
    removeFromCart: (index: number) => dispatch(removeItem(index)),
    updateItem: (index: number, newItem: CartItem) =>
      dispatch(updateItem(index, newItem)),
    // clearCart: () => dispatch(clearCart()),
    clearCart: async () => {
      try {
        await callApi({
          overrideMethod: "DELETE",
          overrideHeaders: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
          overrideBody: JSON.stringify({}),
        });
        dispatch(clearCart());
      } catch (error) {
        console.error("清空购物车失败：", error);
      }
    },
    syncCart: (items: CartItem[]) => dispatch(syncCart(items)),
  };
};
export default useShoppingCartAction;
