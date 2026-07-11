import { RouterProvider } from "react-router-dom";
import router from "./routes";
import AppInit from "./AppInit";

function App() {
  //单根节点原则
  return (
    <div>
      <AppInit />
      {/* 用于程序初始化,如：设置token */}
      <RouterProvider router={router} />
    </div>
  );
}
export default App;
