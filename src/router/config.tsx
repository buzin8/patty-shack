import type { RouteObject } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/home/page";
import MenuPage from "@/pages/menu/page";
import MenuDetailPage from "@/pages/menu-detail/page";
import LocationsPage from "@/pages/locations/page";
import AboutPage from "@/pages/about/page";
import ContactPage from "@/pages/contact/page";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/menu", element: <MenuPage /> },
  { path: "/menu/:id", element: <MenuDetailPage /> },
  { path: "/locations", element: <LocationsPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "*", element: <NotFound /> },
];

export default routes;