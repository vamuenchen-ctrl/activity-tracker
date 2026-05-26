/* RINGANA web kit — top-level App with simple in-memory routing. */

const { useState: useStateApp, useEffect: useEffectApp } = React;

function App() {
  const [route, setRoute] = useStateApp({ name: 'home', productId: null });
  const [cartOpen, setCartOpen] = useStateApp(false);
  const [items, setItems] = useStateApp([]);

  // Lucide refresh after each render (icons may have remounted).
  useEffectApp(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  // Scroll to top on route change
  useEffectApp(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route.name, route.productId]);

  function navigate(name) {
    setRoute({ name, productId: null });
  }
  function openProduct(id) {
    setRoute({ name: 'product', productId: id });
  }
  function addToCart(product, qty) {
    const priceN = parseFloat(product.price.replace(',', '.').replace(' €', ''));
    setItems((prev) => {
      const existing = prev.findIndex((p) => p.id === product.id);
      if (existing >= 0) {
        const copy = [...prev];
        copy[existing] = { ...copy[existing], qty: copy[existing].qty + qty };
        return copy;
      }
      return [...prev, { ...product, qty, priceN }];
    });
    setCartOpen(true);
  }
  function removeItem(idx) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  const activeNav =
    route.name === 'home' ? 'home' :
    route.name === 'story' ? 'story' :
    route.name === 'product' ? 'fresh' :
    route.name;

  return (
    <>
      <Header
        cartCount={items.reduce((n, it) => n + it.qty, 0)}
        onCartOpen={() => setCartOpen(true)}
        onNavigate={navigate}
        active={activeNav}
      />
      {route.name === 'home' && <HomeScreen onNavigate={navigate} onPickProduct={openProduct} />}
      {route.name === 'product' && (
        <ProductDetail
          productId={route.productId}
          onAdd={addToCart}
          onBack={() => navigate('home')}
        />
      )}
      {route.name === 'story' && <EmailScreen />}
      {/* Catch-all: route to home for non-implemented sections */}
      {!['home', 'product', 'story'].includes(route.name) && <HomeScreen onNavigate={navigate} onPickProduct={openProduct} />}
      <Footer />
      <CartDrawer
        open={cartOpen}
        items={items}
        onClose={() => setCartOpen(false)}
        onRemove={removeItem}
        onCheckout={() => alert('Demo · Checkout-Flow nicht implementiert.')}
      />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
