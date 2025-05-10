import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        }

        checkIsMobile()
        window.addEventListener("resize", checkIsMobile)

        return () => {
            window.removeEventListener("resize", checkIsMobile)
        }
    }, [])

    const toggleSidebar = () => {
        setSidebarVisible((prev) => !prev);
    };  

    return (
        <div className="min-h-screen flex">
            <Sidebar toggleSidebar={toggleSidebar} isVisible={isSidebarVisible} isMobile={isMobile} />
            <div className="flex-1">
                <Navbar toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} />
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;