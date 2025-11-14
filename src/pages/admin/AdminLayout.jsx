
import { Outlet } from "react-router-dom";
 import AdminHeader from "../../components/admin/AdminHeader";
 import AdminSidebar from "../../components/admin/AdminSidebar";
 import '../../assets/styles/admin/AdminLayout.css'
const AdminLayout = () => {
    return ( 

        <>
 <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
      </>
     );
}
 
export default AdminLayout;