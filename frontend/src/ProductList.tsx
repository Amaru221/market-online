import { useEffect, useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

type ProductListProps = {
  token: string;
  onLogout: () => void;
};

export function ProductList({ token, onLogout }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch('https://localhost:8000/api/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data['member'] ?? []))
      .catch((err) => console.error('Error fetching products:', err))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lista de Productos</h1>
      <button onClick={onLogout} style={{ marginBottom: '1rem' }}>
        Cerrar sesión
      </button>
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              {p.name} - {p.price.toFixed(2)} €
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
