import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBook,FaTh, FaCommentDots, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import '../../assets/styles/admin/sidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const sidebarItems = [
    { name: "Dashboard Overview", icon: <FaTachometerAlt />, link: "/admin/dashboard" },
    { name: "Gestion Utilisateurs", icon: <FaUsers />, link: "/admin/users" },
      { name: "Gestion Categories", icon: <FaTh />, link: "/admin/categories" },
          { name: "Gestion produits", icon: <FaTh />, link: "/admin/products" },
    { name: "Stories", icon: <FaBook />, link: "/admin/stories" },
    { name: "Modération Avis", icon: <FaCommentDots />, link: "/admin/reviews" },
    { name: "Paramètres", icon: <FaCog />, link: "/admin/settings" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Bouton burger pour mobile */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay pour fermer le menu en cliquant en dehors */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      />

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
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
              <Link to={item.link} onClick={closeSidebar}>
                <span className="icon">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

      
      </aside>
    </>
  );
};

export default AdminSidebar;