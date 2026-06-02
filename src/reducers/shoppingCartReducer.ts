import { Reducer } from "react";
import { CartItem } from "../types/custom";
import { useImmerReducer, ImmerReducer } from "use-immer";

export const addItem = (item: CartItem) => ({
  type: "ADD_ITEM" as const,
  payload: item,
});
export const removeItem = (index: number) => ({
  type: "REMOVE_ITEM" as const,
  payload: index,
});
export const updateItem = (index: number, newItem: CartItem) => ({
  type: "UPDATE_ITEM" as const,
  payload: { index, newItem },
});
export const clearCart = () => ({
  type: "CLEAR_CART" as const,
});

export const syncCart = (items: CartItem[]) => ({
  type: "SYNC_CART" as const,
  payload: items,
});

export type CartAction =
  | ReturnType<typeof addItem>
  | ReturnType<typeof removeItem>
  | ReturnType<typeof updateItem>
  | ReturnType<typeof clearCart>
  | ReturnType<typeof syncCart>;

//reducer function
const shoppingCartReducer: ImmerReducer<CartItem[], CartAction> = (
  draft,
  action,
) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = draft.findIndex(
        (item) => item.productId === action.payload.productId,
      );
      if (existingItemIndex !== -1) {
        draft[existingItemIndex].qty! += 1;
      } else {
        draft.push(action.payload);
      }
      break;
    }
    case "REMOVE_ITEM":
      draft.splice(action.payload, 1);
      break;
    case "UPDATE_ITEM": {
      const { index, newItem } = action.payload;
      if (index < 0 || index >= draft.length) {
        console.log("Index out of bounds");
      } else {
        Object.assign(draft[index], newItem);
      }
      break;
    }
    case "CLEAR_CART":
      draft.length = 0; //clear the cart
      break;
    case "SYNC_CART":
      return action.payload;
    default:
      break;
  }
};
export default shoppingCartReducer;
