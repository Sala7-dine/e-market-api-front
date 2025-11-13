import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers,deleteUser } from '../../features/usersSlice'; 

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  // 🔹 Lancer le fetch au montage du composant
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
   const handleDelete=(userId)=>{
    console.log(userId);
    dispatch(deleteUser(userId));
   }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      <ul>
        {users && users.length > 0 ? (
          users.map((user) => (
            <li key={user._id}>
              {user.fullname} ({user.email})
              <button onClick={() => handleDelete(user._id)}>Supprimer</button>
            </li>
          ))
        ) : (
          <p>Aucun utilisateur trouvé</p>
        )}
      </ul>
    </div>
  );
};

export default UserList;
