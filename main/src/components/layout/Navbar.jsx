import SidebarToggler from "./SidebarToggler";
import ThemeChanger from "./ThemeChanger";

import IconWrapper from "../common/IconWrapper";
import { FaGithub } from "react-icons/fa";

const Navbar = ( {toggleSidebar, isSidebarVisible} ) => {
    return (
        <div className="top-0 min-w-full flex justify-between items-center p-5">
            <div className="space-x-6">
                <SidebarToggler isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
                <ThemeChanger />
            </div>
            <div className="space-x-6">
                <IconWrapper>
                    {/* Github Icon */}
                    <a
                        href="https://github.com/Chitchai-Jantanarak/Numer-ReactRust-WasmLib"
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        <FaGithub size={24} />
                    </a>
                </IconWrapper>
            </div>
        </div>
    );
}

export default Navbar;
