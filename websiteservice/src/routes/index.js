import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import Regist from "../pages/Regist";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import UserServicesPage from "../pages/UserServicesPage";
import ContactPage from "../pages/ContactPage";
import UserPage from "../pages/UserPage";

//admin router
import AdminLogin from "../pages/admin/AdminLogin";
import AdminLayout from "../components/admin/AdminLayout";
import UserManagement from "../pages/admin/UserManagement";
import EventManagement from "../pages/admin/EventManagement";
import ShopManagement from "../pages/admin/ShopManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import MapManagement from "../pages/admin/MapManagement";
import AdminDashboard from "../components/admin/AdminDashboard";
import IsManagement from "../pages/admin/IsManagement";
export const routes = [
    {
        path: "/",
        page: HomePage,
        isShowHeader: true
    },
    {
        path: "/register",
        page: Regist,
        isShowHeader: true
    },
    {
        path: "/login",
        page: Login,
        isShowHeader: true
    },
    {
        path: "/forgot-password",
        page: ForgotPassword,
        isShowHeader: true
    },
    {
        path: "/dich-vu-cua-ban",
        page: UserServicesPage,
        isShowHeader: true
    },
    {
        path: "/contact",
        page: ContactPage,
        isShowHeader: true
    },
    {
        path: "/user",
        page: UserPage,
        isShowHeader: true
    },
    {
        path: "/admin/login",
        page: AdminLogin,
        isShowHeader: false
    },
    {
        path: "/admin",
        page: AdminLayout,
        isShowHeader: false,
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: "users", element: <UserManagement /> },
            { path: "events", element: <EventManagement /> },
            { path: "shop", element: <ShopManagement /> },
            { path: "orders", element: <OrderManagement /> },
            { path: "maps", element: <MapManagement /> },
            { path: "is", element: <IsManagement /> },
        ]
    },
    {
        path: "*",
        page: NotFound,
        isShowHeader: true
    },
];