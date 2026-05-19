import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`http://e-commerce-mern-stack-0okr.onrender.com/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</h2>;
  if (!order) return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Order not found</h2>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: '#e8f5e9', padding: '1rem', borderRadius: '10px', textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#2e7d32', margin: 0 }}>✅ Order Placed Successfully!</h2>
        <p style={{ color: '#666', margin: '0.5rem 0 0' }}>Order ID: {order._id}</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: '#1a1a2e', margin: '0 0 0.5rem' }}>📍 Shipping Address</h3>
          <p>Address: {order.shippingAddress.address}</p>
          <p>City: {order.shippingAddress.city}</p>
          <p>Pincode: {order.shippingAddress.pincode}</p>
          <p>Phone: {order.shippingAddress.phone}</p>
          <p style={{
            background: order.isDelivered ? '#e8f5e9' : '#fff3e0',
            color: order.isDelivered ? '#2e7d32' : '#e65100',
            padding: '0.5rem',
            borderRadius: '5px',
            textAlign: 'center',
            marginTop: '0.5rem',
          }}>
            {order.isDelivered ? '✅ Delivered' : '⏳ Not Delivered Yet'}
          </p>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: '#1a1a2e', margin: '0 0 0.5rem' }}>🧾 Order Status</h3>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e94560', marginTop: '1rem' }}>
            Total: ₹{order.totalPrice}
          </p>
        </div>
      </div>

      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <h3 style={{ color: '#1a1a2e' }}>📦 Order Items</h3>
        {order.orderItems.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.8rem 0',
            borderBottom: index < order.orderItems.length - 1 ? '1px solid #eee' : 'none',
          }}>
            <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: '500' }}>{item.name}</p>
              <p style={{ margin: '0.2rem 0 0', color: '#666', fontSize: '0.9rem' }}>Qty: {item.qty}</p>
            </div>
            <p style={{ fontWeight: 'bold', color: '#e94560' }}>₹{item.price * item.qty}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to='/' style={{
          background: '#e94560',
          color: 'white',
          padding: '0.8rem 2rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
        }}>Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderDetail;