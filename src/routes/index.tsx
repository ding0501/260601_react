import {  Header } from "@/components";
import BlankLayout from "@/layouts/BlankLayout";
import MainLayout from "@/layouts/MainLayout";
import { createBrowserRouter, LoaderFunctionArgs } from "react-router-dom";
import {
  AutoCAD,
  SolidWorks,
  Contact,
 Creo,
  SignIn,
  Register,
  Home,
  NotFound,
  ErrorPage,
} from "../pages";


import RequireAuth from "@/HOCs/RequireAuth";
import { loadProducts } from "@/helpers/loaders";

const router = createBrowserRouter([
  // 根目录 “/”
  {
    path: "/",
    element: <MainLayout header={<Header />}  />,
    children: [
      {
        index: true, // 默认子路由
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: "AutoCAD",
        element: <AutoCAD />,
        errorElement: <ErrorPage />,
      },
      { path: "SolidWorks", element: <SolidWorks />, errorElement: <ErrorPage /> }, // 错误页面
       {
        path: "Creo",
        element: <Creo />,
        errorElement: <ErrorPage />,
      },
      {
        path: "Contact",
        element: <Contact />,
        errorElement: <ErrorPage />,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  // 用户权限目录“/auth”
  {
    path: "/auth",
    element: <BlankLayout />,
    children: [
      { path: "signin", element: <SignIn /> },
      { path: "register", element: <Register /> },
    ],
  },

]);

export default router;
