import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface RequireAuthProps {
  children: ReactNode;
}
const RequireAuth = ({ children }: RequireAuthProps) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  //如果没有 token， 重定向到登录界面，并携带当前路径作为“来源页”
  if (!token) {
    return (
      <Navigate to="/auth/signin" state={{ from: location.pathname }} replace />
    );
  }
  //如果有token，渲染子组件
  return children;
};
export default RequireAuth;
//此页面登录成功之后跳转到现在的页面，如果没有登录直接跳转至登录界面，并记住想要去的地方
