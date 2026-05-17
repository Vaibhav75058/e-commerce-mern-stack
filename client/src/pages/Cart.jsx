import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Your Cart is Empty 🛒</h2>
        <Link to='/' style={{ color: '#e94560', fontWeight: '600', fontSize: '1.1rem' }}>
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#1a1a2e' }}>🛒 Your Cart ({totalItems} items)</h2>

      {cartItems.map((item) => (
        <div key={item._id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'white',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        }}>
          <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, color: '#1a1a2e' }}>{item.name}</h3>
            <p style={{ margin: '0.3rem 0', color: '#666' }}>Qty: {item.qty}</p>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#e94560' }}>₹{item.price * item.qty}</p>
          </div>
          <button onClick={() => removeFromCart(item._id)} style={{
            background: '#ff4444',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
          }}>Remove</button>
        </div>
      ))}

      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        marginTop: '1rem',
        textAlign: 'right',
      }}>
        <h3 style={{ color: '#1a1a2e' }}>Total: ₹{totalPrice}</h3>
        <button onClick={handleCheckout} style={{
          background: '#e94560',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
        }}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;