import { CartItem } from "@/types";
import React, {
  createContext,
  useReducer,
  useContext,
  PropsWithChildren,
  useState,
} from "react";
import { randomUUID } from "expo-crypto";
import { Tables } from "@/database.types";
import { useInsertOrder, useInsertOrderItems } from "@/api/orders";
import { router, useRouter } from "expo-router";
import { Alert } from "react-native";
import { initialisePaymentSheet } from "@/lib/stripe";

interface DeliveryDetails {
  type: string; // 'delivery' or 'pickup'
  location: string;
  date: Date | null;
}

type Product = Tables<"products">;
type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem["size"]) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => void;
  DeliveryDetails: DeliveryDetails;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  paymentMethod: string;
  setpaymentMethod: (method: string) => void;
};

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
  DeliveryDetails: { type: "", location: "", date: null },
  setDeliveryDetails: () => {},
  paymentMethod: "",
  setpaymentMethod: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [DeliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    type: "",
    location: "",
    date: null,
  });
  const [paymentMethod, setpaymentMethod] = useState<string>("CashDelivery");

  const router = useRouter();
  //Increment the quantity of the item in the cart

  const { mutate: InsertOrder } = useInsertOrder();
  const { mutate: InsertOrderItems } = useInsertOrderItems();

  const addItem = (product: Product, size: CartItem["size"]) => {
    const existingItem = items.find(
      (item) => item.product === product && item.size === size
    );
    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }
    const newCartItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      quantity: 1,
      size,
      delivery: "",
      deliveryDate: new Date(),
      paymentMethod: "",
    };
    setItems([newCartItem, ...items]);
  };
  //update the quantity of the item in the cart
  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    const updatedItems = items
      .map((item) =>
        item.id !== itemId
          ? item
          : { ...item, quantity: item.quantity + amount }
      )
      .filter((item) => item.quantity > 0);
    setItems(updatedItems);
  };
  const total = items.reduce(
    (sum, item) => (sum += item.product.price * item.quantity),
    0
  );
  const handleDeliveryDetails = (newDeliveryDetails: DeliveryDetails) => {
    // Update the DeliveryDetails state in the context
    setDeliveryDetails(newDeliveryDetails);
  };
  const handlepaymentMethod = (method: string) => {
    setpaymentMethod(method);
  };

  const clearCart = () => {
    setItems([]);
  };
  const checkout = async () => {
    if (items.length === 0) {
      Alert.alert(
        "Cart is empty",
        "Please add items to cart before checking out"
      );
      return;
    }
    InsertOrder(
      {
        total,
        status: "New",
        delivery: DeliveryDetails.location,
        type: DeliveryDetails.type,
        deliveryDate: DeliveryDetails.date?.toDateString() || "",
        paymentMethod: paymentMethod,
      },
      {
        onSuccess: (order) => {
          if (!order) return;

          const orderItems = items.map((cartItem) => ({
            orderId: order.id, // Corrected property name from 'order_id' to 'orderId'
            productId: cartItem.product_id, // Ensure this name matches what's expected
            quantity: cartItem.quantity,
            size: cartItem.size as string, // Assuming you need to convert an enum or custom type to string
          }));
          console.log("paymentMethod ", paymentMethod);
          InsertOrderItems(orderItems, {
            // Pass array directly
            onSuccess: () => {
              clearCart();
              router.push(`/(user)/orders/${order.id}`);
            },
          });
        },
      }
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        total,
        checkout,
        setDeliveryDetails: handleDeliveryDetails, // Function to update
        DeliveryDetails,
        setpaymentMethod: handlepaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartProvider;

export const useCart = () => useContext(CartContext);
