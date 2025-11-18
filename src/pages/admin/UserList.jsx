import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../../features/usersSlice';
import '../../assets/styles/admin/UserList.css'
import { FaTrash } from "react-icons/fa";

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);


  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  const handleDelete = (userId) => {
    console.log(userId);
    dispatch(deleteUser(userId));
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <div className="user-list">
        <h2>Gestion Utilisateurs</h2>
        <p>Gérez et surveillez tous les utilisateurs de votre plateforme</p>

        <div className='stat-user'>
          <div className='stat-item'>
            <h3>Total Utilisateurs</h3>
            <p>{users.length}</p>
          </div>
          <div className='stat-item'>
            <h3>Utilisateurs Actifs</h3>
            <p>{users.length}</p>
          </div>

          <div className='stat-item'>
            <h3>Utilisateurs Bloqués</h3>
            <p>{users.length}</p>
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
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                  <td>
                    
                    <button className="btn-delete" onClick={()=> handleDelete(user._id)}>
                      <FaTrash size={16} color="#A0522D" />
                      
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </div>


    </>
    // <div>
    //   <h2>Liste des utilisateurs</h2>
    //   <ul>
    //     {users && users.length > 0 ? (
    //       users.map((user) => (
    //         <li key={user._id}>
    //           {user.fullname} ({user.email})
    //           <button onClick={() => handleDelete(user._id)}>Supprimer</button>
    //         </li>
    //       ))
    //     ) : (
    //       <p>Aucun utilisateur trouvé</p>
    //     )}
    //   </ul>
    // </div>
  );
};

export default UserList;
