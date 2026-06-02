import { Reducer, Dispatch, useReducer, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import { useImmerReducer, ImmerReducer } from "use-immer";

const usePresistedReducer = <S, A>(
  reducer: ImmerReducer<S, A>,
  key: string,
  initialState: S,
): [S, Dispatch<A>] => {
  // 1.先从localstorage 读状态
  const [presistedState, setPresistedState] = useLocalStorage<S>(
    key,
    initialState,
  );

  // 2.把reducer 和持久化状态结合
  const [state, dipatch] = useImmerReducer(reducer, presistedState);

  // 3.状态变化时，自动同步到localstorage
  useEffect(() => {
    setPresistedState(state);
  }, [state, setPresistedState]);
  return [state, dipatch] as const;
};
export default usePresistedReducer;
