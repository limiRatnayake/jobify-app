import { NavLink } from "react-router-dom";
import { useDashboardContext } from "../pages/DashboardLayout";
import links from "../utils/links";

const NavLinks = ({ idBigSidebar }) => {
  const { user, toggleSidebar } = useDashboardContext();
  return (
    <div className="nav-links">
      {links.map((link, index) => {
        const { text, path, icon } = link;
        const {role} = user
        if(role !== 'admin' && path === 'admin') return
        return (
          <NavLink
            to={path}
            key={index}
            className="nav-link"
            onClick={idBigSidebar ? null : toggleSidebar}
            end
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};
export default NavLinks;
