import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AboutPage from "./pages/AboutPage";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";

// Search param validator — allows arbitrary string search params
function validateSearch(
  search: Record<string, unknown>,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(search)) {
    if (typeof v === "string") result[k] = v;
  }
  return result;
}

// Root route — must render <Outlet /> so child routes can mount
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Child routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsPage,
  validateSearch,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$productId",
  component: ProductDetailPage,
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/category/$categorySlug",
  component: CategoryPage,
  validateSearch,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

// Route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  productsRoute,
  productDetailRoute,
  categoryRoute,
  cartRoute,
  aboutRoute,
  contactRoute,
]);

// Router
const router = createRouter({ routeTree });

// Type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
