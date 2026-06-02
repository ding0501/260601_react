//主程序
import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css"; //引入css文件
import App from "./App";
import store from "./redux/store";
import { Provider } from "react-redux";
import "./i18n/config"; //引入 i18n 配置文件，i18n 的配置会自动执行

//JSX 是JavaScript的语法扩展，它让我们可以在JavaScript里面直接写出类似HTML的结构
//JSX =HTML的语法 + JavaScript的能力     命名时：App合法的，app不合法
const root = document.getElementById("root") ?? document.createElement("div"); //获取id为root的元素
// if (!root) {
//   throw new Error("Root element not found"); //如果没有找到根元素，抛出错误
// }
const rootElement = ReactDOM.createRoot(root); //创建一个react根元素
rootElement.render(
  // <React.StrictMode>
  //   {/* 严格模式，帮助我们发现潜在问题 */}
  //   {/* React.StrictMode 是一个工具，用于帮助我们发现潜在问题 */}
  //   {/* 它不会渲染任何 UI，只会激活额外的检查和警告 */}
  //   {/* 它可以帮助我们发现不安全的生命周期方法、过时的 API 等问题 */}
  //   {/* 在开发模式下，它会额外渲染一次组件 ，以帮助我们发现副作用*/}
  //   {/* 在生产模式下，它不会额外渲染一次组件 */}
  //   {/* 它不会影响生产模式下的性能 */}
  //   {/* 它不会影响组件的行为 */}
  //   {/* 它不会影响组件的性能 */}
  //   {/* 它不会影响组件的生命周期 */}
  //   {/* 它不会影响组件的状态 */}
  //   {/* 它不会影响组件的属性 */}
  //   {/* 它不会影响组件的事件 */}
  //   {/* 它不会影响组件的上下文 */}
  //   <App />
  // </React.StrictMode>,
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
); //渲染App组件到根元素

//React版（17及之前)
//ReactDOM.render(<App/>,document.getElementById("root"));
//不推荐！！！ 因为新版本的createRoot支持并发渲染等新特性
