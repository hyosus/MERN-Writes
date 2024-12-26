import LeftSidebar from "@/components/LeftSidebar";
import Topbar from "@/components/Topbar";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen p-4">
      <Topbar />
      <div className="flex flex-grow h-full pt-4 gap-4">
        <LeftSidebar />
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
