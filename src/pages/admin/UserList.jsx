import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser,updateUser } from "../../features/usersSlice";
import Pagination from "../../components/Pagination";
import "../../assets/styles/admin/UserList.css";
import { FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";

const UserList = () => {
  const dispatch = useDispatch();
  const { users, pagination, loading, error } = useSelector(
    (state) => state.users
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [idetignId, setIdetingId] = useState(-1);
  const [selectOption,setSelectedOption]=useState("");

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleDelete = (userId) => {
    dispatch(deleteUser(userId));
  };

  const handleUpdate = (userId,option) => {
    // dispatch(updateRole(userId));
    setIdetingId(userId);
    setSelectedOption(option);
  };
  const handleSave=()=>{
    dispatch(updateUser({id:idetignId,data:{role:selectOption}}))
    setIdetingId(-1);
        setSelectedOption("");
    


  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <div className="user-list">
        <h2>Gestion Utilisateurs</h2>
        <p>Gérez et surveillez tous les utilisateurs de votre plateforme</p>

        <div className="stat-user">
          <div className="stat-item">
            <h3>Total Utilisateurs</h3>
            <p>{pagination.totalUsers}</p>
          </div>
          <div className="stat-item">
            <h3>Page Courante</h3>
            <p>{pagination.currentPage}</p>
          </div>

          <div className="stat-item">
            <h3>Total Pages</h3>
            <p>{pagination.totalPages}</p>
          </div>
        </div>
        <div className="users-table-container">
          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Date de création</th>

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>
                    {idetignId === user._id ? (
                      <select onChange={(e)=>{
                        setSelectedOption(e.target.value)

                      }}     value={selectOption}>

                        <option  value="user">user</option>
                        <option value="seller">seller</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                  <td>
                    {idetignId === user._id ? (
                      <button onClick={handleSave}>save</button>
                    ) : (
                      <>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(user._id)}
                        >
                          <FaTrash size={16} color="#FF6F61" />
                        </button>
                        <button
                          className="btn-update"
                          onClick={() => handleUpdate(user._id,user.role)}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
        />

        <div className="pagination-info">
          Affichage de {users.length} utilisateurs sur {pagination.totalUsers}{" "}
          au total
        </div>
      </div>
    </>
  );
};

export default UserList;
