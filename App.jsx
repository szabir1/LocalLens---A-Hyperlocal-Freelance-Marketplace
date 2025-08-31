import "./app.scss";
import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import React from "react";
import ScrollToTop from "./components/ScrollToTop"; 
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Orders from "./pages/orders/Orders";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import MyGigs from "./pages/myGigs/MyGigs";
import Pay from "./pages/pay/Pay";
import Success from "./pages/success/Success";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ComplaintForm from "./pages/complaint/ComplaintForm";
import AdminComplaints from "./pages/complaint/AdminComplaints";
import ComplaintList from "./pages/complaint/ComplaintList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  // Layout wrapper with Navbar + Footer + QueryClient + ScrollToTop
  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <ScrollToTop />
          <Navbar />
          <Outlet />
          <Footer />
        </QueryClientProvider>
      </div>
    );
  };

  // Admin route protection
  const AdminRoute = ({ children }) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      return <Navigate to="/" />; // redirect non-admins
    }
    return children;
  };

  // Browser router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/gigs", element: <Gigs /> },
        { path: "/myGigs", element: <MyGigs /> },
        { path: "/orders", element: <Orders /> },
        { path: "/messages", element: <Messages /> },
        { path: "/message/:id", element: <Message /> },
        { path: "/add", element: <Add /> },
        { path: "/gig/:id", element: <Gig /> },
        { path: "/register", element: <Register /> },
        { path: "/login", element: <Login /> },
        { path: "/pay/:id", element: <Pay /> },
        { path: "/success", element: <Success /> },

        // Complaint routes
        { path: "/complaint/new", element: <ComplaintForm /> },

        // Admin dashboard route
        {
          path: "/admin",
          element: (
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          ),
        },
        {
          path: "/admin/complaints",
          element: (
            <AdminRoute>
              <AdminComplaints />
            </AdminRoute>
          ),
        },
        {
          path: "/admin/complaints/list",
          element: (
            <AdminRoute>
              <ComplaintList />
            </AdminRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
