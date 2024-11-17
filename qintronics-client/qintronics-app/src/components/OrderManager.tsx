import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../common/utils/axios-instance.util";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  brand: string;
  img: string;
}
interface OrderProduct {
  product: Product;
  quantity: number;
  priceAtOrderTime: number;
}
export interface Order {
  id: string;
  address: string;
  city: string;
  zip: number;
  email: string;
  firstName: string;
  lastName: string;
  prefDeliveryDate: string;
  isPaid: boolean;
  isTaken: boolean;
  isDelivered: boolean;
  isCanceled: boolean;
  total: number;
  orderProduct: OrderProduct[];
}

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [user]);

  useEffect(() => {
    if (user?.role === "Customer") {
      setOrders(orders.filter((order) => order.email === user?.email));
    }
  }, [user]);

  const fetchOrders = async () => {
    if (user?.role === "Customer") {
      await axiosInstance.get(`/orders/${user?.userId}`).then((res) => {
        setOrders(res.data);
        setLoading(false);
      });
    }

    const payload = {
      paginationQueries: {
        page: 1,
        perPage: 10,
      },
      queryParams: {},
    };

    if (user?.role === "Delivery_Person" || user?.role === "Admin") {
      await axiosInstance.post(`/orders/get`, { ...payload }).then((res) => {
        setOrders(res.data.data);
        setLoading(false);
      });
    }

    setLoading(false);
  };

  const handleOrderStatusChange = async (status: string, orderId?: string) => {
    if (status === "Taken") {
      await axiosInstance
        .put(`/orders/status/${orderId}`, { isTaken: true })
        .then((res) => console.log(res));
    }

    if (status === "Canceled") {
      await axiosInstance.put(`/orders/cancel/${orderId}`).then((res) => console.log(res));
    }

    if (status === "Delivered") {
      await axiosInstance
        .put(`/orders/status/${orderId}`, { isDelivered: true })
        .then((res) => console.log(res));
    }

    await fetchOrders();

    console.log(orderId);
  };

  const getOrderStatus = (order: Order) => {
    if (!order.isDelivered && !order.isTaken && !order.isCanceled && !order.isPaid)
      return <p className="font-semibold text-gray-500">Unpaid</p>;

    if (order.isDelivered) return <p className="font-semibold text-green-500">Delivered</p>;
    if (order.isTaken) return <p className="font-semibold text-yellow-500">Delivering...</p>;
    if (order.isCanceled) return <p className="font-semibold text-red-500">Cancelled</p>;
    if (order.isPaid) return <p className="font-semibold text-green-500">Paid</p>;
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading orders...</div>;
  }

  if (orders.length <= 0) {
    return <div className="text-center text-gray-500">No orders found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h2 className="text-3xl font-light text-gray-800 mb-8">Order Management</h2>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate(`/order/${order.id}`)}
          >
            <div className="flex flex-col justify-center gap-2 w-full cursor-pointer">
              <div className="flex justify-between items-center">
                <p className="italic">Order #{index + 1}</p>
                {getOrderStatus(order)}
              </div>
              <hr />
              <p>
                <span className="font-semibold">Products: </span>
                {order.orderProduct.length}
              </p>
              <p>
                <span className="font-semibold">Total: </span>${order.total.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Address: </span>
                {order.address}, {order.city}, {order.zip}
              </p>
              <p>
                <span className="font-semibold">Preferred Delivery Date: </span>
                {order.prefDeliveryDate}
              </p>
              {(user?.role === "Customer" || user?.role === "Admin") &&
                order.isDelivered === false &&
                order.isTaken === false &&
                order.isCanceled === false && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderStatusChange("Canceled", order.id);
                    }}
                    className="absolute bottom-5 right-5 bg-red-500 hover:scale-105 py-2 px-4 rounded-xl text-white font-bold text-sm shadow-xl"
                  >
                    Cancel
                  </button>
                )}

              {user?.role === "Delivery_Person" &&
                order.isDelivered === false &&
                order.isTaken === false &&
                order.isCanceled === false && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderStatusChange("Taken", order.id);
                    }}
                    className="absolute bottom-5 right-5 bg-blue-600 hover:scale-105 py-2 px-4 rounded-xl text-white font-bold text-sm shadow-xl"
                  >
                    Take Order
                  </button>
                )}

              {user?.role === "Delivery_Person" &&
                order.isDelivered === false &&
                order.isTaken === true &&
                order.isCanceled === false && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderStatusChange("Delivered", order.id);
                    }}
                    className="absolute bottom-5 right-5 bg-blue-600 hover:scale-105 py-2 px-4 rounded-xl text-white font-bold text-sm shadow-xl"
                  >
                    Deliver Order
                  </button>
                )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OrderManager;
