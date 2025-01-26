import { Menu } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useRef, useState } from "react";
import LeftSidebar from "./LeftSidebar";
import useClickOutside from "@/hooks/useClickOutside";

function Topbar() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const sideBarRef = useRef(null);

  useClickOutside(sideBarRef, () => {
    setSidebarVisible(false);
  });

  return (
    <>
      <div className="flex items-center justify-between md:justify-end p-4 h-[60px] w-full text-white bg-zinc-900 rounded-lg">
        <Menu
          size={30}
          className="md:hidden"
          onClick={() => setSidebarVisible(!isSidebarVisible)}
        />
        <ProfileMenu />
      </div>
      {/* Overlay with fade animation */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden transition-opacity duration-300 ${
          isSidebarVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarVisible(false)}
      >
        {/* Sidebar with slide animation */}
        <div
          ref={sideBarRef}
          onClick={(e) => e.stopPropagation()} // Prevent click propagation to overlay
          className={`fixed inset-y-0 left-0 w-64 bg-zinc-900 p-4 z-50 transform transition-transform duration-300 ${
            isSidebarVisible ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <LeftSidebar
            isSidebarVisible={isSidebarVisible}
            onClose={() => setSidebarVisible(false)}
          />
        </div>
      </div>
    </>
  );
}

export default Topbar;
