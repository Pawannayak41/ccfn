import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/products";

const App = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get(API_URL);
    setProducts(response.data);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    if (image) formData.append("image", image);

    await axios.post(API_URL, formData, { headers: { "Content-Type": "multipart/form-data" } });
    setName("");
    setPrice("");
    setImage(null);
    setShowForm(false);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchProducts();
  };

  return (
    <div className="container">
      <h1>Electronics Store</h1>
      <button className="add-btn" onClick={() => setShowForm(true)}>Add Product</button>
      {showForm && (
        <div className="modal">
          <form onSubmit={addProduct} encType="multipart/form-data">
            <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            <button type="submit">Add Product</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>Product: {product.name}</h3>
            <p>Price: Rs {product.price}</p>
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="product-img" />}
            <button className="delete-btn" onClick={() => deleteProduct(product.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default App;
