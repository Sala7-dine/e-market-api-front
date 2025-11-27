import { useDispatch, useSelector } from "react-redux";
import { FaUsers, FaShoppingBag, FaTag } from "react-icons/fa";
import { fetchUsers } from "../../features/usersSlice";
import { fetchAllProducts } from "../../features/productSlice";
import { fetchCategories } from "../../features/categorySlice";
import { useEffect } from "react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 100 }));
    dispatch(fetchAllProducts({ page: 1, limit: 100 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937", marginBottom: "0.5rem" }}
        >
          Dashboard Admin
        </h1>
        <p style={{ color: "#6b7280" }}>Vue d'ensemble des statistiques de votre plateforme</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#EFF6FF",
              color: "#3B82F6",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            <FaUsers />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937", margin: 0 }}>
              {users?.length || 0}
            </h3>
            <p style={{ color: "#6b7280", margin: 0, fontSize: "0.9rem" }}>Total Utilisateurs</p>
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#ECFDF5",
              color: "#10B981",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            <FaShoppingBag />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937", margin: 0 }}>
              {products?.length || 0}
            </h3>
            <p style={{ color: "#6b7280", margin: 0, fontSize: "0.9rem" }}>Total Produits</p>
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#FFFBEB",
              color: "#F59E0B",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            <FaTag />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937", margin: 0 }}>
              {categories?.length || 0}
            </h3>
            <p style={{ color: "#6b7280", margin: 0, fontSize: "0.9rem" }}>Total Catégories</p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "1rem",
              borderBottom: "2px solid #e5e7eb",
              paddingBottom: "0.5rem",
            }}
          >
            Détails Utilisateurs
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Utilisateurs actifs</span>
              <span style={{ fontWeight: "600", color: "#1f2937" }}>
                {users?.filter((u) => u.role === "user")?.length || 0}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Administrateurs</span>
              <span style={{ fontWeight: "600", color: "#1f2937" }}>
                {users?.filter((u) => u.role === "admin")?.length || 0}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Vendeurs</span>
              <span style={{ fontWeight: "600", color: "#1f2937" }}>
                {users?.filter((u) => u.role === "seller")?.length || 0}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "1rem",
              borderBottom: "2px solid #e5e7eb",
              paddingBottom: "0.5rem",
            }}
          >
            Détails Produits
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>En stock</span>
              <span style={{ fontWeight: "600", color: "#1f2937" }}>
                {products?.filter((p) => p.stock > 0)?.length || 0}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Rupture de stock</span>
              <span style={{ fontWeight: "600", color: "#1f2937" }}>
                {products?.filter((p) => p.stock === 0)?.length || 0}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Valeur du stock</span>
              <span style={{ fontWeight: "600", color: "#1f2937" }}>
                {products?.reduce((sum, p) => sum + p.price * p.stock, 0) || 0}€
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "1rem",
              borderBottom: "2px solid #e5e7eb",
              paddingBottom: "0.5rem",
            }}
          >
            Détails Catégories
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Catégories actives</span>
              <span style={{ fontWeight: "600", color: "#1f2937" }}>
                {categories?.filter((c) => c.isActive !== false)?.length || 0}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Catégories inactives</span>
              <span style={{ fontWeight: "600", color: "#1f2937" }}>
                {categories?.filter((c) => c.isActive === false)?.length || 0}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Total catégories</span>
              <span style={{ fontWeight: "600", color: "#1f2937" }}>{categories?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
