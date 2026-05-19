import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: '', image: '', brand: '', stock: '',
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, []);

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` },
  };

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        axios.get('https://e-commerce-mern-stack-0okr.onrender.com/api/orders', config),
        axios.get('https://e-commerce-mern-stack-0okr.onrender.com/api/products', config),
        axios.get('https://e-commerce-mern-stack-0okr.onrender.com/api/users', config),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await axios.delete(`https://e-commerce-mern-stack-0okr.onrender.com/api/products/${id}`, config);
        setProducts(products.filter((p) => p._id !== id));
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://e-commerce-mern-stack-0okr.onrender.com/api/products', newProduct, config);
      setProducts([...products, data]);
      setNewProduct({ name: '', description: '', price: '', category: '', image: '', brand: '', stock: '' });
      alert('Product created!');
    } catch (error) {
      alert('Error creating product');
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct({ ...product });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `https://e-commerce-mern-stack-0okr.onrender.com/api/products/${editingProduct._id}`,
        editingProduct,
        config
      );
      setProducts(products.map((p) => p._id === data._id ? data : p));
      setEditingProduct(null);
      alert('Product updated!');
    } catch (error) {
      alert('Error updating product');
    }
  };

  const handleDeliverOrder = async (id) => {
    try {
      await axios.put(`https://e-commerce-mern-stack-0okr.onrender.com/api/orders/${id}/deliver`, {}, config);
      setOrders(orders.map((o) =>
        o._id === id ? { ...o, isDelivered: true, status: 'Delivered' } : o
      ));
    } catch (error) {
      alert('Error updating order');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await axios.delete(`https://e-commerce-mern-stack-0okr.onrender.com/api/users/${id}`, config);
        setUsers(users.filter((u) => u._id !== id));
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</h2>;

  const tabStyle = (tab) => ({
    padding: '0.7rem 1.5rem',
    background: activeTab === tab ? '#e94560' : 'white',
    color: activeTab === tab ? 'white' : '#1a1a2e',
    border: '1px solid #e94560',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '500',
  });

  const inputStyle = {
    width: '100%',
    padding: '0.6rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontSize: '0.9rem',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ color: '#1a1a2e', marginBottom: '1.5rem' }}>Admin Dashboard</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['dashboard', 'products', 'orders', 'users'].map((tab) => (
          <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { label: 'Total Orders', value: orders.length, color: '#3f51b5' },
            { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: '#e94560' },
            { label: 'Total Users', value: users.length, color: '#4caf50' },
            { label: 'Total Products', value: products.length, color: '#ff9800' },
            { label: 'Delivered Orders', value: orders.filter(o => o.isDelivered).length, color: '#009688' },
            { label: 'Pending Orders', value: orders.filter(o => !o.isDelivered).length, color: '#f44336' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: 'white',
              borderRadius: '10px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${stat.color}`,
            }}>
              <p style={{ color: '#666', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>{stat.label}</p>
              <h3 style={{ color: stat.color, margin: 0, fontSize: '1.8rem' }}>{stat.value}</h3>
            </div>
          ))}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div>
          {/* EDIT FORM */}
          {editingProduct && (
            <div style={{ background: '#fff8e1', border: '2px solid #ff9800', borderRadius: '10px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#e65100' }}>✏️ Edit Product</h3>
              <form onSubmit={handleEditSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { label: 'Name', key: 'name' },
                    { label: 'Brand', key: 'brand' },
                    { label: 'Category', key: 'category' },
                    { label: 'Price', key: 'price' },
                    { label: 'Stock', key: 'stock' },
                    { label: 'Image URL', key: 'image' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: '500' }}>{field.label}</label>
                      <input
                        type='text'
                        value={editingProduct[field.key]}
                        onChange={(e) => setEditingProduct({ ...editingProduct, [field.key]: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: '500' }}>Description</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    style={{ ...inputStyle, height: '80px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type='submit' style={{ padding: '0.8rem 2rem', background: '#ff9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600' }}>
                    Update Product
                  </button>
                  <button type='button' onClick={() => setEditingProduct(null)} style={{ padding: '0.8rem 2rem', background: '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ADD PRODUCT FORM */}
          <div style={{ background: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>➕ Add New Product</h3>
            <form onSubmit={handleCreateProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Name', key: 'name', placeholder: 'Product name' },
                  { label: 'Brand', key: 'brand', placeholder: 'Brand name' },
                  { label: 'Category', key: 'category', placeholder: 'Category' },
                  { label: 'Price', key: 'price', placeholder: 'Price in ₹' },
                  { label: 'Stock', key: 'stock', placeholder: 'Stock quantity' },
                  { label: 'Image URL', key: 'image', placeholder: 'Image URL' },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: '500' }}>{field.label}</label>
                    <input
                      type='text'
                      placeholder={field.placeholder}
                      value={newProduct[field.key]}
                      onChange={(e) => setNewProduct({ ...newProduct, [field.key]: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: '500' }}>Description</label>
                <textarea
                  placeholder='Product description'
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{ ...inputStyle, height: '80px' }}
                />
              </div>
              <button type='submit' style={{ marginTop: '1rem', padding: '0.8rem 2rem', background: '#e94560', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>
                Add Product
              </button>
            </form>
          </div>

          {/* PRODUCTS TABLE */}
          <div style={{ background: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>All Products ({products.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  {['Image', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '0.8rem', textAlign: 'left', fontSize: '0.9rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.8rem' }}>
                      <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                    </td>
                    <td style={{ padding: '0.8rem', fontSize: '0.9rem', fontWeight: '500' }}>{product.name}</td>
                    <td style={{ padding: '0.8rem' }}>{product.category}</td>
                    <td style={{ padding: '0.8rem', color: '#e94560', fontWeight: '600' }}>₹{product.price.toLocaleString()}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        background: product.stock > 5 ? '#e8f5e9' : product.stock > 0 ? '#fff3e0' : '#ffebee',
                        color: product.stock > 5 ? '#2e7d32' : product.stock > 0 ? '#e65100' : '#c62828',
                      }}>
                        {product.stock}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditClick(product)}
                          style={{ background: '#ff9800', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          style={{ background: '#f44336', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div style={{ background: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>All Orders ({orders.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                {['Order ID', 'User', 'Items', 'Total', 'Date', 'Status', 'Action'].map((h) => (
                  <th key={h} style={{ padding: '0.8rem', textAlign: 'left', fontSize: '0.9rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.8rem', fontSize: '0.8rem', color: '#666', fontFamily: 'monospace' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td style={{ padding: '0.8rem', fontSize: '0.9rem' }}>{order.user?.name || 'N/A'}</td>
                  <td style={{ padding: '0.8rem', fontSize: '0.9rem' }}>{order.orderItems?.length} items</td>
                  <td style={{ padding: '0.8rem', color: '#e94560', fontWeight: '600' }}>₹{order.totalPrice.toLocaleString()}</td>
                  <td style={{ padding: '0.8rem', fontSize: '0.85rem', color: '#666' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding: '0.8rem' }}>
                    <span style={{
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: order.isDelivered ? '#e8f5e9' : '#fff3e0',
                      color: order.isDelivered ? '#2e7d32' : '#e65100',
                    }}>
                      {order.isDelivered ? '✅ Delivered' : '🚚 Processing'}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem' }}>
                    {!order.isDelivered ? (
                      <button
                        onClick={() => handleDeliverOrder(order._id)}
                        style={{ background: '#4caf50', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                        Mark Delivered
                      </button>
                    ) : (
                      <span style={{ color: '#4caf50', fontSize: '0.85rem', fontWeight: '600' }}>✅ Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div style={{ background: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>All Users ({users.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                {['Name', 'Email', 'Role', 'Joined', 'Action'].map((h) => (
                  <th key={h} style={{ padding: '0.8rem', textAlign: 'left', fontSize: '0.9rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.8rem', fontWeight: '500' }}>{u.name}</td>
                  <td style={{ padding: '0.8rem', color: '#666' }}>{u.email}</td>
                  <td style={{ padding: '0.8rem' }}>
                    <span style={{
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: u.isAdmin ? '#e3f2fd' : '#f5f5f5',
                      color: u.isAdmin ? '#1565c0' : '#666',
                    }}>
                      {u.isAdmin ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem', fontSize: '0.85rem', color: '#666' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding: '0.8rem' }}>
                    {!u.isAdmin && (
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        style={{ background: '#f44336', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                        🗑️ Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;