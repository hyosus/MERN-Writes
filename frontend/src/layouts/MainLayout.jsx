import LeftSidebar from "@/components/LeftSidebar";
import Topbar from "@/components/Topbar";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen p-4">
      <Topbar />
      <div className="flex flex-grow gap-4 overflow-hidden pt-4">
        <LeftSidebar className="h-full overflow-auto" />
        <main className="flex flex-col flex-grow bg-zinc-900 rounded-lg p-8 h-full overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
