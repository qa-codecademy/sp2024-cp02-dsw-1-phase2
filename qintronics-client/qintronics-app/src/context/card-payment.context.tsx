import { ReactNode, createContext, useState } from "react";
import { OrderDetails } from "../common/interfaces/order.details.interface";

type CardPaymentContextProviderType = {
  children: ReactNode | ReactNode[];
};

type CardPaymentContextType = {
  orderDetails: OrderDetails | null;
  setOrderDetails: (orderDetails: OrderDetails) => void;
};

const defaultValues: CardPaymentContextType = {
  orderDetails: null,
  setOrderDetails: () => {},
};

export const CardPaymentContext =
  createContext<CardPaymentContextType>(defaultValues);

export default function CardPaymentProvider({
  children,
}: CardPaymentContextProviderType) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  return (
    <CardPaymentContext.Provider value={{ orderDetails, setOrderDetails }}>
      {children}
    </CardPaymentContext.Provider>
  );
}
