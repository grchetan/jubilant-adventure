import type { RouteObject } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import FlashPage from "@/flash/FlashPage";
import site from "@/flash/site.json";
import DashboardPage from "@/pages/dashboard/page";
import MenuEditorPage from "@/pages/dashboard/menu/page";
import QrPage from "@/pages/dashboard/qr/page";
import ShopPage from "@/pages/shop/page";
import SupportPage from "@/pages/support/page";
import PublicMenuPage from "@/pages/publicMenu/page";
import CreatePage from "@/pages/create/page";
import HowToUsePage from "@/pages/howToUse/page";

// 营销页来自 site.json；下面是产品本身的页面（每个功能一个独立地址，不再是单页）。
const routes: RouteObject[] = [
  ...site.pages.map((page) => ({
    path: page.path,
    element: <FlashPage page={page} />,
  })),
  { path: "/create", element: <CreatePage /> },
  { path: "/how-to-use", element: <HowToUsePage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/dashboard/menu", element: <MenuEditorPage /> },
  { path: "/dashboard/qr", element: <QrPage /> },
  { path: "/shop", element: <ShopPage /> },
  { path: "/support", element: <SupportPage /> },
  { path: "/menu/:slug", element: <PublicMenuPage /> },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;