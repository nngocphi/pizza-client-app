import { useState } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Header from "../Header";
import PizzaOfTheDay from "../PizzaOfTheDay";
import { CartContext } from "../contexts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Route = createRootRoute({
  component: () => {
    const cartHook = useState([]);

    return (
      <>
        <CartContext.Provider value={cartHook}>
          <>
            <Header />
            <Outlet />
            <PizzaOfTheDay />
          </>
        </CartContext.Provider>
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </>
    );
  },
});
