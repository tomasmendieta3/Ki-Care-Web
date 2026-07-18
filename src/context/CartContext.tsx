import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { type Producto, formatPrice } from "@/data/productos.data";

export interface CartItem {
  producto: Producto;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD"; producto: Producto }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE_QTY"; id: string; quantity: number }
  | { type: "CLEAR" };

interface CartContextValue extends CartState {
  addItem: (producto: Producto) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  formatTotal: string;
}

const CartContext = createContext<CartContextValue | null>(null);

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const exists = state.items.find((i) => i.producto.id === action.producto.id);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.producto.id === action.producto.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { producto: action.producto, quantity: 1 }] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.producto.id !== action.id) };
    case "UPDATE_QTY":
      if (action.quantity < 1) return { items: state.items.filter((i) => i.producto.id !== action.id) };
      return {
        items: state.items.map((i) =>
          i.producto.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const STORAGE_KEY = "kicare_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { items: [] }, () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { items: [] };
    } catch {
      return { items: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const total = state.items.reduce(
    (sum, i) => sum + i.producto.precioActual * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem: (producto) => dispatch({ type: "ADD", producto }),
        removeItem: (id) => dispatch({ type: "REMOVE", id }),
        updateQuantity: (id, quantity) => dispatch({ type: "UPDATE_QTY", id, quantity }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        itemCount: state.items.reduce((sum, i) => sum + i.quantity, 0),
        total,
        formatTotal: formatPrice(total),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
