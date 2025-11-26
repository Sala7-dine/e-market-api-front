import "../../assets/styles/admin/header.css";
import boy from "../../assets/images/boy.jpg";
import { useAuth } from "../../contexts/AuthContext";
import { FaBell } from "react-icons/fa";

const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <>
      <header className="admin-header">
        <input
          type="text"
          placeholder="Rechercher des utilisateurs, commandes, produits..."
          className="search-input"
        />
        <div className="header-right">
          <div className="notification">
            <FaBell color="#FF6F61" />
          </div>
          <div className="user-info">
            <img src={boy} alt="Profile" className="user-avatar" />
            <div className="role-name">
              <span className="user-name">{user?.fullName} </span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;
