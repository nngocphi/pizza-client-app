import { useContext, useEffect, useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import Pizza from "../Pizza.jsx";
import Cart from "../Cart.jsx";
import { CartContext } from "../contexts.jsx";
import { priceConverter } from "../useCurrency.jsx";

export const Route = createLazyFileRoute("/order")({
  component: Order,
});

function Order() {
  const [pizzaTypes, setPizzaTypes] = useState([]);
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState("S");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useContext(CartContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  let price, selectedPizza;

  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = priceConverter(selectedPizza.sizes[pizzaSize]);
  }

  useEffect(() => {
    fetchPizzaTypes();
  }, []);

  async function fetchPizzaTypes() {
    const pizzaRes = await fetch(`${apiUrl}/api/pizzas`);
    const pizzaJson = await pizzaRes.json();
    setPizzaTypes(pizzaJson);
    setLoading(false);
  }

  async function checkout() {
    setLoading(true);

    await fetch(`${apiUrl}/api/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    });

    setCart([]);
    setLoading(false);
  }

  return (
    <div className="order-page">
      <div className="order">
        <h2>Create Order</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCart([
              ...cart,
              { pizza: selectedPizza, size: pizzaSize, price },
            ]);
          }}
        >
          <div>
            <div>
              <label htmlFor="pizza-type">Pizza Type</label>
              <select
                name="pizza-type"
                id="pizza-type"
                value={pizzaType}
                onChange={(e) => setPizzaType(e.target.value)}
              >
                {pizzaTypes.map((pizzaType) => (
                  <option key={pizzaType.id} value={pizzaType.id}>
                    {pizzaType.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pizza-size">Pizza Size</label>
              <div>
                <span>
                  <input
                    type="radio"
                    checked={pizzaSize === "S"}
                    name="pizza-size"
                    id="pizza-s"
                    value="S"
                    onChange={(e) => setPizzaSize(e.target.value)}
                  />
                  <label htmlFor="pizza-s">Small</label>
                </span>
                <span>
                  <input
                    type="radio"
                    checked={pizzaSize === "M"}
                    name="pizza-size"
                    id="pizza-m"
                    value="M"
                    onChange={(e) => setPizzaSize(e.target.value)}
                  />
                  <label htmlFor="pizza-m">Medium</label>
                </span>
                <span>
                  <input
                    type="radio"
                    checked={pizzaSize === "L"}
                    name="pizza-size"
                    id="pizza-l"
                    value="L"
                    onChange={(e) => setPizzaSize(e.target.value)}
                  />
                  <label htmlFor="pizza-l">Large</label>
                </span>
              </div>
            </div>
            <button type="submit">Add to Cart</button>
          </div>

          {loading ? (
            <h3>Loading Pizza...</h3>
          ) : (
            <div className="order-pizza">
              <Pizza
                name={selectedPizza.name}
                description={selectedPizza.description}
                image={selectedPizza.image}
              />
              <p>{price}</p>
            </div>
          )}
        </form>
      </div>
      {loading ? (
        <h3>Loading Cart...</h3>
      ) : (
        <Cart cart={cart} checkout={checkout} />
      )}
    </div>
  );
}
