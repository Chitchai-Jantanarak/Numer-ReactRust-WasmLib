import SidebarToggler from "./SidebarToggler";

const Sidebar = ({ isVisible, isMobile, toggleSidebar }) => {
    return  (
        <div 
            className={`bg-base-200 transition-all duration-300 h-screen overflow-y-auto top-0 left-0 
            ${isMobile ? "fixed z-20" : "relative"} 
            ${isVisible ? "w-80 min-w-80" : isMobile ? "w-0 min-w-0" : "w-0 min-w-0"}`}
        >
            {isVisible &&
            <div className="p-3 font-bold text-xl items-center">
                {isMobile && <SidebarToggler isSidebarVisible={isVisible} toggleSidebar={toggleSidebar} />} 
            </div>
            }
        </div>
    )
}

export default Sidebar;