import { Footer, Header } from "@/components";
import BlankLayout from "@/layouts/BlankLayout";
import MainLayout from "@/layouts/MainLayout";
import UserLayout from "@/layouts/UserLayout";
import { createBrowserRouter, LoaderFunctionArgs } from "react-router-dom";
import {
  About,
  AutoCAD,
  SolidWorks,
  Phones,
  Contact,
  SignIn,
  Register,
  Home,
  NotFound,
  ErrorPage,
  ProductDetail,
  SearchResults,
  UserCenter,
  ShoppingCart,
  Category,
  CheckOut,
  OrderDetail,
} from "../pages";
import RequireAuth from "@/HOCs/RequireAuth";
import { loadProducts } from "@/helpers/loaders";

const router = createBrowserRouter([
  // 根目录 “/”
  {
    path: "/",
    element: <MainLayout header={<Header />} footer={<Footer />} />,
    children: [
      {
        index: true, // 默认子路由
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: "categories/:category",
        element: <Category />,
        errorElement: <ErrorPage />,
      },
      { path: "about", element: <About />, errorElement: <ErrorPage /> },

      {
        path: "AutoCAD",
        element: <AutoCAD />,
        errorElement: <ErrorPage />,
      },
      { path: "SolidWorks", element: <SolidWorks />, errorElement: <ErrorPage /> }, // 错误页面
      {
        path: "Contact",
        element: <Contact />,
        errorElement: <ErrorPage />,
      },
      {
        path: "product-detail/:id", //  product-detail/123
        element: <ProductDetail />,
        errorElement: <ErrorPage />,
        loader: async ({ params, request }: LoaderFunctionArgs) => {
          const productId = params.id;
          if (!productId) {
            throw new Response("为产品提供ID", {
              status: 400,
              statusText: "Bad Request",
            });
          }
          return await loadProducts(productId, request.signal);
        },
      },
      {
        path: "search",
        element: <SearchResults />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/cart",
        element: <ShoppingCart />,
      },
      {
        path: "/checkout",
        element: <CheckOut />,
      },
      {
        path: "/orders/:id",
        element: <OrderDetail />,
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
  {
    path: "/user",
    element: (
      <RequireAuth>
        <UserLayout />
      </RequireAuth>
    ),
    children: [{ path: "", element: <UserCenter /> }],
  },
]);

export default router;
