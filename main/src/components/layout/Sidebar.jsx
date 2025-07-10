import { Link, useLocation } from "react-router-dom";
import SidebarToggler from "./SidebarToggler";
import { routesByCategory } from "../../config/routeConfig";

const Sidebar = ({ isVisible, isMobile, toggleSidebar }) => {
  const location = useLocation();

  return (
    <div
      className={`bg-base-200 transition-all duration-300 h-screen overflow-y-auto top-0 left-0 sticky
        ${isMobile ? "fixed z-20" : "relative"} 
        ${isVisible ? "w-80 min-w-80" : isMobile ? "w-0 min-w-0" : "w-0 min-w-0"}`}
    >
      {isVisible && (
        <div className="p-3 font-bold text-xl items-center">
          <div className="px-4 py-2 text-sm space-y-4">
            {Object.entries(routesByCategory).map(([category, links]) => (
              <div key={category}>
                <div className="text-gray-400 uppercase tracking-widest font-semibold mb-2">
                  {category}
                </div>
                <ul className="space-y-1">
                  {links.map(({ path, name }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        className={`block px-2 py-1 rounded hover:bg-base-300 ${
                          location.pathname === path ? "bg-base-300 font-bold" : ""
                        }`}
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {isMobile && (
              <SidebarToggler
                isSidebarVisible={isVisible}
                toggleSidebar={toggleSidebar}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
