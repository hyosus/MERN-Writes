import useAuth from "@/hooks/useAuth.js";
import { LoaderCircle } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const AppContainer = () => {
  const { user, isLoading } = useAuth();
  return (
    <>
      {isLoading ? (
        <>
          <div className="flex items-center justify-center h-screen w-full">
            <LoaderCircle size={50} className="animate-spin" />
          </div>
        </>
      ) : user ? (
        <Outlet />
      ) : (
        <Navigate
          to="/login"
          replace
          state={{ redirectUrl: window.location.pathname }}
        />
      )}
    </>
  );
};

export default AppContainer;
