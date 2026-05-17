import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</h2>;
  if (!product) return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Product not found</h2>;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: '1px solid #ccc',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '1.5rem',
        }}>
        ← Back
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        background: 'white',
        borderRadius: '10px',
        padding: '2rem',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
      }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', borderRadius: '10px', objectFit: 'cover' }}
        />

        <div>
          <h1 style={{ margin: '0 0 1rem', color: '#1a1a2e' }}>{product.name}</h1>
          <p style={{ color: '#666', marginBottom: '1rem' }}>{product.description}</p>

          <div style={{
            background: '#f8f8f8',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}>
            <p style={{ margin: '0.3rem 0' }}><strong>Brand:</strong> {product.brand}</p>
            <p style={{ margin: '0.3rem 0' }}><strong>Category:</strong> {product.category}</p>
            <p style={{ margin: '0.3rem 0' }}><strong>Rating:</strong> ⭐ {product.rating} ({product.numReviews} reviews)</p>
            <p style={{ margin: '0.3rem 0' }}>
              <strong>Status:</strong>{' '}
              <span style={{ color: product.stock > 0 ? 'green' : 'red' }}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </p>
          </div>

          <p style={{ fontSize: '2rem', color: '#e94560', fontWeight: 'bold', margin: '1rem 0' }}>
            ₹{product.price}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              width: '100%',
              padding: '1rem',
              background: added ? '#4caf50' : product.stock > 0 ? '#e94560' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
              transition: 'background 0.3s',
            }}>
            {added ? '✅ Added to Cart!' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <button
            onClick={() => navigate('/cart')}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'white',
              color: '#1a1a2e',
              border: '2px solid #1a1a2e',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '0.8rem',
            }}>
            🛒 Go to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;