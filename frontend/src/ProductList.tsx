import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './ProductList.module.css';

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

type ProductListProps = {
  token: string;
};

const PRODUCTS_PER_PAGE = 12;

export function ProductList({ token }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const fetchProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const startTime = Date.now();

    try {
      const res = await fetch(
        `https://localhost:8000/api/products?page=${pageRef.current}&itemsPerPage=${PRODUCTS_PER_PAGE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      const newProducts = data['hydra:member'] ?? data.member ?? [];

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const filtered = newProducts.filter((p: Product) => !existingIds.has(p.id));
        return [...prev, ...filtered];
      });

      if (newProducts.length < PRODUCTS_PER_PAGE) {
        setHasMore(false);
      } else {
        pageRef.current += 1;
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 5000 - elapsed); // mínimo 5 segundos spinner

      setTimeout(() => {
        setLoading(false);
      }, delay);
    }
  }, [token, loading, hasMore]);

  useEffect(() => {
    fetchProducts();

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 150 &&
        !loading &&
        hasMore
      ) {
        fetchProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchProducts, loading, hasMore]);

  return (
    <div className={styles.productContainer}>
      <h1 className={styles.title}>Lista de Productos</h1>
      <div className={styles.grid}>
        {products.map((p) => (
          <div key={p.id} className={styles.card}>
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.name} className={styles.productImage} />
            ) : (
              <div className={styles.placeholder}></div>
            )}
            <h3>{p.name}</h3>
            <p>{p.price.toFixed(2)} €</p>
            <p>Stock: {p.stock}</p>
          </div>
        ))}
      </div>
      {loading && (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      )}
    </div>
  );
}
