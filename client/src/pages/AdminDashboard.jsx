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

  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: '', image: '', brand: '', stock: ''
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

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/orders', config),
        axios.get('http://localhost:5000/api/products', config),
        axios.get('http://localhost:5000/api/users', config),
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
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        setProducts(products.filter((p) => p._id !== id));
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/products', newProduct, config);
      setProducts([...products, data]);
      setNewProduct({ name: '', description: '', price: '', category: '', image: '', brand: '', stock: '' });
      alert('Product created successfully!');
    } catch (error) {
      alert('Error creating product');
    }
  };

  const handleDeliverOrder = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/deliver`, {}, config);
      setOrders(orders.map((o) => o._id === id ? { ...o, isDelivered: true, status: 'Delivered' } : o));
    } catch (error) {
      alert('Error updating order');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, config);
        setUsers(users.filter((u) => u._id !== id));
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</h2>;

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#1a1a2e' }}>⚙️ Admin Dashboard</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['dashboard', 'products', 'orders', 'users'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '0.6rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === tab ? '#e94560' : '#eee',
            color: activeTab === tab ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: '500',
            textTransform: 'capitalize',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Total Orders', value: orders.length, bg: '#e3f2fd' },
            { label: 'Revenue', value: `₹${totalRevenue}`, bg: '#fce4ec' },
            { label: 'Users', value: users.length, bg: '#e8f5e9' },
            { label: 'Products', value: products.length, bg: '#fff3e0' },
            { label: 'Delivered', value: orders.filter(o => o.isDelivered).length, bg: '#e0f7fa' },
            { label: 'Pending', value: orders.filter(o => !o.isDelivered).length, bg: '#fce4ec' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: stat.bg,
              padding: '1.5rem',
              borderRadius: '10px',
              textAlign: 'center',
            }}>
              <p style={{ color: '#666', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>{stat.label}</p>
              <h2 style={{ margin: 0, color: '#1a1a2e' }}>{stat.value}</h2>
            </div>
          ))}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            marginBottom: '2rem',
          }}>
            <h3>➕ Add New Product</h3>
            <form onSubmit={handleCreateProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {['name', 'brand', 'category', 'price', 'stock', 'image'].map((field) => (
                <input key={field} type='text' placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={newProduct[field]}
                  onChange={(e) => setNewProduct({ ...newProduct, [field]: e.target.value })}
                  style={{ padding: '0.7rem', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              ))}
              <textarea placeholder='Description' value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                style={{ padding: '0.7rem', borderRadius: '5px', border: '1px solid #ccc', gridColumn: 'span 2' }}
              />
              <button type='submit' style={{
                gridColumn: 'span 2',
                padding: '0.8rem',
                background: '#e94560',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600',
              }}>Add Product</button>
            </form>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a1a2e', color: 'white' }}>
                <th style={{ padding: '0.8rem' }}>Name</th>
                <th style={{ padding: '0.8rem' }}>Category</th>
                <th style={{ padding: '0.8rem' }}>Price</th>
                <th style={{ padding: '0.8rem' }}>Stock</th>
                <th style={{ padding: '0.8rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} style={{ borderBottom: '1px solid #eee', background: 'white' }}>
                  <td style={{ padding: '0.8rem' }}>{product.name}</td>
                  <td style={{ padding: '0.8rem' }}>{product.category}</td>
                  <td style={{ padding: '0.8rem', color: '#e94560', fontWeight: 'bold' }}>₹{product.price}</td>
                  <td style={{ padding: '0.8rem' }}>{product.stock}</td>
                  <td style={{ padding: '0.8rem' }}>
                    <button onClick={() => handleDeleteProduct(product._id)} style={{
                      background: '#ff4444',
                      color: 'white',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1a1a2e', color: 'white' }}>
              <th style={{ padding: '0.8rem' }}>Order ID</th>
              <th style={{ padding: '0.8rem' }}>User</th>
              <th style={{ padding: '0.8rem' }}>Total</th>
              <th style={{ padding: '0.8rem' }}>Status</th>
              <th style={{ padding: '0.8rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: '1px solid #eee', background: 'white' }}>
                <td style={{ padding: '0.8rem' }}>{order._id.slice(-8)}</td>
                <td style={{ padding: '0.8rem' }}>{order.user?.name || 'N/A'}</td>
                <td style={{ padding: '0.8rem', color: '#e94560', fontWeight: 'bold' }}>₹{order.totalPrice}</td>
                <td style={{ padding: '0.8rem' }}>
                  <span style={{
                    background: order.isDelivered ? '#e8f5e9' : '#fff3e0',
                    color: order.isDelivered ? '#2e7d32' : '#e65100',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                  }}>{order.status}</span>
                </td>
                <td style={{ padding: '0.8rem' }}>
                  {!order.isDelivered && (
                    <button onClick={() => handleDeliverOrder(order._id)} style={{
                      background: '#4caf50',
                      color: 'white',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}>Mark Delivered</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1a1a2e', color: 'white' }}>
              <th style={{ padding: '0.8rem' }}>Name</th>
              <th style={{ padding: '0.8rem' }}>Email</th>
              <th style={{ padding: '0.8rem' }}>Admin</th>
              <th style={{ padding: '0.8rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid #eee', background: 'white' }}>
                <td style={{ padding: '0.8rem' }}>{u.name}</td>
                <td style={{ padding: '0.8rem' }}>{u.email}</td>
                <td style={{ padding: '0.8rem' }}>{u.isAdmin ? '✅' : '❌'}</td>
                <td style={{ padding: '0.8rem' }}>
                  {!u.isAdmin && (
                    <button onClick={() => handleDeleteUser(u._id)} style={{
                      background: '#ff4444',
                      color: 'white',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;