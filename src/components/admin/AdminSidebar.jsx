import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBook, FaCommentDots, FaCog } from 'react-icons/fa';
import '../../assets/styles/admin/sidebar.css';

const AdminSidebar = () => {
  const location = useLocation();

  const sidebarItems = [
    { name: "Dashboard Overview", icon: <FaTachometerAlt />, link: "/admin/dashboard" },
    { name: "Gestion Utilisateurs", icon: <FaUsers />, link: "/admin/users" },
    { name: "Stories", icon: <FaBook />, link: "/admin/stories" },
    { name: "Modération Avis", icon: <FaCommentDots />, link: "/admin/reviews" },
    { name: "Paramètres", icon: <FaCog />, link: "/admin/settings" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <h2>Zendora</h2>
        <span>Admin Panel</span>
      </div>
    

      <ul className="sidebar-menu">
        {sidebarItems.map((item) => (
          <li
            key={item.name}
            className={location.pathname === item.link ? 'active' : ''}
          >
            <Link to={item.link}>
              <span className="icon">{item.icon}</span>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* <div className="sidebar-help">
        <p>Besoin d'aide?</p>
        <button>Contactez le support</button>
      </div> */}
    </aside>
  );
};

export default AdminSidebar;
