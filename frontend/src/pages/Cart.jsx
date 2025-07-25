import { useContext } from 'react';
import CartContext from '../context/CartContext.jsx';

export default function Cart() {
  const { items, total } = useContext(CartContext);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mi Carrito</h2>
      {items.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {items.map((item, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                {item.name}
                <span>${item.price}</span>
              </li>
            ))}
          </ul>
          <h4>Total: ${total}</h4>
        </>
      )}
    </div>
  );
}
