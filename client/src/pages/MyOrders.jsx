import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('https://e-commerce-mern-stack-0okr.onrender.com/api/orders/myorders', config);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</h2>;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#1a1a2e' }}>📦 My Orders</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h3>No orders yet!</h3>
          <Link to='/' style={{ color: '#e94560' }}>Start Shopping</Link>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ background: '#1a1a2e', color: 'white' }}>
              <th style={{ padding: '0.8rem' }}>Order ID</th>
              <th style={{ padding: '0.8rem' }}>Date</th>
              <th style={{ padding: '0.8rem' }}>Total</th>
              <th style={{ padding: '0.8rem' }}>Status</th>
              <th style={{ padding: '0.8rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: '1px solid #eee', background: 'white' }}>
                <td style={{ padding: '0.8rem', textAlign: 'center' }}>{order._id.slice(-8)}</td>
                <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '0.8rem', textAlign: 'center', fontWeight: 'bold', color: '#e94560' }}>
                  ₹{order.totalPrice}
                </td>
                <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                  <span style={{
                    background: order.isDelivered ? '#e8f5e9' : '#fff3e0',
                    color: order.isDelivered ? '#2e7d32' : '#e65100',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                  <Link to={`/order/${order._id}`} style={{
                    background: '#1a1a2e',
                    color: 'white',
                    padding: '0.4rem 1rem',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                  }}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;