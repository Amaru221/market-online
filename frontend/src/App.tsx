import { useEffect, useState } from 'react'

type Product = {
  id: number
  name: string
  price: number
  stock: number
  imageUrl?: string
}

function App() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data['hydra:member'] ?? []))
      .catch(err => console.error('Error fetching products:', err))
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lista de Productos</h1>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - {p.price.toFixed(2)} €
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App