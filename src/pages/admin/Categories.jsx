import '../../assets/styles/admin/Categories.css';
import { FaTrash, FaSync } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchCategories, createCategory ,deleteCategory,updateCategory} from '../../features/categorySlice';

const Categories = () => {

  const { categories, loading, error } = useSelector(state => state.categories);

  const dispatch = useDispatch();

  // ---- STATE POUR MODAL ----
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [text,setText]=useState("ajouter");
  const [editId,setEditId]=useState(null);
 


  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // ---- SUBMIT NEW CATEGORY ----
 const handleSubmit = () => {
  if (!name.trim() || !description.trim()) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  if(editId){
    // Mode update
    dispatch(updateCategory({id: editId, data: {name, description}}));
    setEditId(null);
    setText("Ajouter");
  } else {
    // Mode create
    dispatch(createCategory({ name, description }));
  }

  setShowModal(false);
  setName("");
  setDescription("");
};

  const handleDelete=(categoryId)=>{
    dispatch(deleteCategory(categoryId));
  }
  const handleUpdate=(categoryId,name,description)=>{
     
    setDescription(description);
     setName(name);
     setText("Modifier");
     setEditId(categoryId);
     setShowModal(true);
     

 }
 
  return (
    <>
      <div className="container-category">

        <div className='content-btn'>
          <div className='content'>
            <h2>Gestion Categories</h2>
            <p>Gérez et surveillez tous les categories de votre plateforme</p>
          </div>

          <div className='btn-add'>
            <button onClick={() => setShowModal(true)}>
              Ajouter une catégorie
            </button>
          </div>
        </div>

        <div className="categories-table-container">
          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>name</th>
                <th>description</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map(c => (
                <tr key={c._id}>
                  <td>{c._id}</td>
                  <td>{c.name}</td>
                  <td>{c.description}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>

                  <td>
                    <div className='action-btn'>
                      <button className="btn-update"  onClick={()=>{handleUpdate(c._id,c.name,c.description) }}>
                        <FaSync size={16} color="#A0522D" />
                      </button>
                      <button className="btn-delete" onClick={()=> handleDelete(c._id)} >
                        <FaTrash size={16} color="#A0522D" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

      {/* ----- MODAL ADD CATEGORY ----- */}
      {showModal && (
        <div className="modal-overlay">

          <div className="modal-box">
      <h3>{editId ? "Modifier une catégorie" : "Ajouter une catégorie"}</h3>

            <input
              type="text"
              placeholder="Nom de la catégorie"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              rows="4"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn-save" onClick={handleSubmit}>{text}</button>
            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default Categories;
