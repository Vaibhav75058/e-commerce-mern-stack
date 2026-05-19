import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const slides = [
    { bg: '#0f3460', title: 'Latest Electronics', sub: 'Up to 40% off on phones & laptops', btn: 'Shop Electronics', cat: 'Electronics', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300' },
    { bg: '#16213e', title: 'Top Fashion Brands', sub: 'Nike, Adidas, Levis — all in one place', btn: 'Shop Fashion', cat: 'Fashion', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300' },
    { bg: '#1a1a2e', title: 'Home & Kitchen', sub: 'Make your home beautiful', btn: 'Shop Now', cat: 'Home & Kitchen', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 3500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div style={{
      background: slide.bg,
      padding: '3rem 4rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'background 0.5s',
      minHeight: '280px',
    }}>
      <div>
        <p style={{ color: '#e94560', margin: '0 0 0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Special Offer</p>
        <h1 style={{ color: 'white', margin: '0 0 1rem', fontSize: '2.5rem', fontWeight: '700' }}>{slide.title}</h1>
        <p style={{ color: '#aaa', margin: '0 0 1.5rem', fontSize: '1.1rem' }}>{slide.sub}</p>
        <Link to={`/?category=${slide.cat}`} style={{
          background: '#e94560',
          color: 'white',
          padding: '0.8rem 2rem',
          borderRadius: '30px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '1rem',
        }}>
          {slide.btn} →
        </Link>
      </div>
      <img src={slide.img} alt={slide.title} style={{
        width: '250px',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '15px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
      }} />
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? '24px' : '8px',
            height: '8px',
            borderRadius: '4px',
            background: i === current ? '#e94560' : '#555',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: hovered ? '0 8px 30px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}>
        <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.3s ease',
              display: 'block',
            }}
          />
          {product.stock < 5 && product.stock > 0 && (
            <span style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: '#ff9800',
              color: 'white',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600',
            }}>Only {product.stock} left</span>
          )}
          {product.stock === 0 && (
            <span style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: '#f44336',
              color: 'white',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600',
            }}>Out of Stock</span>
          )}
        </div>
        <div style={{ padding: '1rem' }}>
          <p style={{ color: '#e94560', fontSize: '11px', fontWeight: '600', margin: '0 0 4px', textTransform: 'uppercase' }}>{product.brand}</p>
          <h3 style={{ margin: '0 0 6px', fontSize: '0.95rem', fontWeight: '600', color: '#1a1a2e', lineHeight: '1.4' }}>
            {product.name.length > 35 ? product.name.slice(0, 35) + '...' : product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '0 0 8px' }}>
            <span style={{ color: '#f4a261', fontSize: '13px' }}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span style={{ color: '#888', fontSize: '12px' }}>({product.numReviews})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: '#e94560', fontWeight: '700', fontSize: '1.2rem', margin: 0 }}>₹{product.price.toLocaleString()}</p>
            <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: '500' }}>Free Delivery</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const SkeletonCard = () => (
  <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
    <div style={{ width: '100%', height: '220px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
    <div style={{ padding: '1rem' }}>
      {[80, 120, 60, 100].map((w, i) => (
        <div key={i} style={{ height: '12px', width: `${w}%`, background: '#f0f0f0', borderRadius: '4px', margin: '8px 0' }} />
      ))}
    </div>
  </div>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(200000);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = ['All', ...new Set(products.map((p) => p.category))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  const fetchProducts = async (keyword = '') => {
    try {
      setLoading(true);
      const { data } = await axios.get(`https://e-commerce-mern-stack-0okr.onrender.com/api/products?keyword=${keyword}`);
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const filteredProducts = products
    .filter((p) => selectedCategory === 'All' || p.category === selectedCategory)
    .filter((p) => p.price <= priceRange)
    .filter((p) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      <div style={{ position: 'relative' }}>
        <HeroBanner />
      </div>

      <div style={{ background: '#f8f8f8', padding: '0.8rem 2rem', borderBottom: '1px solid #eee', display: 'flex', gap: '1rem', overflowX: 'auto' }}>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
            padding: '0.4rem 1.2rem',
            borderRadius: '20px',
            border: 'none',
            background: selectedCategory === cat ? '#e94560' : 'white',
            color: selectedCategory === cat ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '2rem', padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ width: '240px', flexShrink: 0 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '1rem' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#1a1a2e', fontSize: '1rem' }}>🔍 Search</h3>
            <form onSubmit={handleSearch}>
              <input
                type='text'
                placeholder='Search by name, brand, category...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
              <button type='submit' style={{ width: '100%', marginTop: '0.5rem', padding: '0.6rem', background: '#e94560', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                Search
              </button>
            </form>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '1rem' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#1a1a2e', fontSize: '1rem' }}>📂 Category</h3>
            {categories.map((cat) => (
              <div key={cat} onClick={() => setSelectedCategory(cat)} style={{
                padding: '0.5rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                background: selectedCategory === cat ? '#fff0f3' : 'transparent',
                color: selectedCategory === cat ? '#e94560' : '#555',
                fontWeight: selectedCategory === cat ? '600' : '400',
                fontSize: '0.9rem',
                marginBottom: '4px',
                borderLeft: selectedCategory === cat ? '3px solid #e94560' : '3px solid transparent',
              }}>
                {cat}
              </div>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '1rem' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#1a1a2e', fontSize: '1rem' }}>💰 Price Range</h3>
            <input type='range' min='0' max='200000' value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#e94560' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
              <span>₹0</span>
              <span style={{ color: '#e94560', fontWeight: '600' }}>₹{priceRange.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#1a1a2e', fontSize: '1rem' }}>↕️ Sort By</h3>
            {[
              { value: 'default', label: 'Default' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'rating', label: 'Top Rated' },
            ].map((opt) => (
              <div key={opt.value} onClick={() => setSortBy(opt.value)} style={{
                padding: '0.5rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                background: sortBy === opt.value ? '#fff0f3' : 'transparent',
                color: sortBy === opt.value ? '#e94560' : '#555',
                fontWeight: sortBy === opt.value ? '600' : '400',
                fontSize: '0.9rem',
                marginBottom: '4px',
                borderLeft: sortBy === opt.value ? '3px solid #e94560' : '3px solid transparent',
              }}>
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, color: '#1a1a2e', fontSize: '1.3rem' }}>
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
              <span style={{ color: '#888', fontSize: '1rem', fontWeight: '400', marginLeft: '0.5rem' }}>({filteredProducts.length} items)</span>
            </h2>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
              <p style={{ fontSize: '3rem' }}>🔍</p>
              <h3>No products found</h3>
              <p>Try changing filters or search term</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer style={{ background: '#1a1a2e', color: 'white', padding: '3rem 4rem', marginTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
          <div>
            <h3 style={{ color: '#e94560', marginBottom: '1rem' }}>ShopEase</h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>Your one-stop shop for electronics, fashion, and home essentials.</p>
          </div>
          {[
            { title: 'Quick Links', links: ['Home', 'Products', 'Cart', 'My Orders'] },
            { title: 'Categories', links: ['Electronics', 'Fashion', 'Home & Kitchen'] },
            { title: 'Support', links: ['Contact Us', 'FAQ', 'Return Policy', 'Track Order'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>{col.title}</h4>
              {col.links.map((link) => (

                <Link

                  key={link}

                  to={
                    link === "Home"
                      ? "/"
                      : link === "Products"
                        ? "/products"
                        : link === "Cart"
                          ? "/cart"
                          : link === "My Orders"
                            ? "/myorders"
                            : "#"
                  }

                  style={{
                    color: '#aaa',
                    fontSize: '0.9rem',
                    margin: '0.4rem 0',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'block'
                  }}

                  onMouseEnter={e =>
                    e.target.style.color = '#e94560'
                  }

                  onMouseLeave={e =>
                    e.target.style.color = '#aaa'
                  }

                >
                  {link}

                </Link>

              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #333', marginTop: '2rem', paddingTop: '1rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          © 2026 ShopEase. All rights reserved. Made with ❤️ by Vaibhav
        </div>
      </footer>
    </div>
  );
};

export default Home;