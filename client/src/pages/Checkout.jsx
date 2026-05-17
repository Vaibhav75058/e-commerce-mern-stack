import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!address || !city || !pincode || !phone) {
      alert('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: { address, city, pincode, phone },
        totalPrice,
      };
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('http://localhost:5000/api/orders', orderData, config);
      clearCart();
      navigate(`/order/${data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#1a1a2e', marginBottom: '1.5rem' }}>📦 Checkout</h2>

      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
      }}>
        <h3>Shipping Address</h3>

        {['Address', 'City', 'Pincode', 'Phone'].map((label) => (
          <div key={label} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>{label}</label>
            <input
              type='text'
              placeholder={`Enter ${label.toLowerCase()}`}
              value={label === 'Address' ? address : label === 'City' ? city : label === 'Pincode' ? pincode : phone}
              onChange={(e) => {
                if (label === 'Address') setAddress(e.target.value);
                if (label === 'City') setCity(e.target.value);
                if (label === 'Pincode') setPincode(e.target.value);
                if (label === 'Phone') setPhone(e.target.value);
              }}
              style={{
                width: '100%',
                padding: '0.7rem',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}

        <div style={{
          background: '#f8f8f8',
          padding: '1rem',
          borderRadius: '8px',
          margin: '1rem 0',
        }}>
          <h4>Order Summary</h4>
          {cartItems.map((item) => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.3rem 0' }}>
              <span>{item.name} x {item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
            <span>Total</span>
            <span style={{ color: '#e94560' }}>₹{totalPrice}</span>
          </div>
        </div>

        <button onClick={handlePlaceOrder} disabled={loading} style={{
          width: '100%',
          padding: '1rem',
          background: '#e94560',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: '600',
        }}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;