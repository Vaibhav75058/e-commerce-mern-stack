import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#1a1a2e',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    }}>
      <Link to='/' style={{ color: '#e94560', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
        ShopEase
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to='/' style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem' }}>Home</Link>

        <Link to='/cart' style={{ color: 'white', textDecoration: 'none', position: 'relative', fontSize: '0.95rem' }}>
          🛒 Cart
          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-12px',
              background: '#e94560',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {totalItems}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <Link to='/myorders' style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem' }}>
              📦 My Orders
            </Link>
            {user.isAdmin && (
              <Link to='/admin' style={{ color: '#f4a261', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' }}>
                ⚙️ Admin
              </Link>
            )}
            <span style={{ color: '#e94560', fontSize: '0.95rem' }}>Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                background: '#e94560',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to='/login' style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem' }}>Login</Link>
            <Link to='/register' style={{
              background: '#e94560',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;