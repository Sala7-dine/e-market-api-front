import '../../assets/styles/admin/header.css'
import boy from '../../assets/images/boy.jpg';


const AdminHeader = () => {

    
    return (
        <header className="admin-header">
            <input
                type="text"
                placeholder="Rechercher des utilisateurs, commandes, produits..."
                className="search-input"
            />
            <div className="header-right">
                <div className="notification">🔔</div>
                <div className="user-info">
                    <img
                        src={boy}
                        alt="Profile"
                        className="user-avatar"
                    />
                    <div className='role-name'>
                        <span className="user-name"> 'Utilisateur'</span>
                        <span className="user-role">'Admin'</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;