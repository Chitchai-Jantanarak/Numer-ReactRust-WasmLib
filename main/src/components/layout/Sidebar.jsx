import { Link, useLocation } from "react-router-dom";
import SidebarToggler from "./SidebarToggler";
import { routesByCategories } from "../../config/methodConfigs";

const Sidebar = ({ isVisible, isMobile, toggleSidebar }) => {
  const location = useLocation();

  // Function to get current topic info
  const getCurrentTopicInfo = () => {
    for (const [category, links] of Object.entries(routesByCategories)) {
      const currentLink = links.find(link => link.path === location.pathname);
      if (currentLink) {
        return {
          category,
          name: currentLink.name
        };
      }
    }
    return null;
  };

  const currentTopic = getCurrentTopicInfo();

  return (
    <div
      className={`backdrop-brightness-125 transition-all duration-300 h-screen overflow-y-auto top-0 left-0 sticky
        ${isMobile ? "fixed z-20" : "relative"} 
        ${isVisible ? "w-80 min-w-80" : isMobile ? "w-0 min-w-0" : "w-0 min-w-0"}`}
      data-lenis-prevent
    >
      {isVisible && (
        <div className="p-3 pb-12 text-left">

          {/* Header */}
          <div className="flex p-3 space-x-2 justify-between">
            {currentTopic && isMobile && (
              <div className="px-4 py-3 mb-4 border-b border-base-content">
                <div className="text-sm text-base-content/70 mb-1">
                  {currentTopic.category}
                </div>
                <div className="text-lg font-bold text-base-content">
                  {currentTopic.name}
                </div>
              </div>
            )}
            {isMobile && (
                <div className="top-0">
                  <SidebarToggler isSidebarVisible={isVisible} toggleSidebar={toggleSidebar} />
                </div>
            )}
          </div>
          
          {/* Content */}
          <div className="py-2 text-sm space-y-4">
            {Object.entries(routesByCategories).map(([category, links]) => (
              <div key={category}>
                <ul className="menu mb-2">
                  <li>
                    <h4 className="menu-title font-en font-extrabold text-base-content">{category}</h4>
                    <ul className="space-y-1">
                      {links.map(({ path, name }) => (
                        <li key={path}>
                          <Link
                            to={path}
                            className={`px-2 py-1 text-base-content/80 hover:bg-base-100 ${
                              location.pathname === path 
                                ? "bg-base-200"
                                : ""
                            }`}
                          >
                            {name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;