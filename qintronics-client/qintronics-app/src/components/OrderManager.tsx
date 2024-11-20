import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../common/utils/axios-instance.util";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

// Import icons from lucide-react
import { ShoppingCart, DollarSign, MapPin, CalendarPlus2, CalendarClock } from "lucide-react";

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
  createdAt: Date;
}

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [page, setPage] = useState(1);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    setLoading(false);
  }, [user, page]);

  const fetchOrders = async () => {
    if (user?.role === "Customer") {
      await axiosInstance.get(`/orders/${user?.userId}`).then((res) => {
        setOrders(res.data);
        setLoading(false);
      });
    }

    const payload = {
      paginationQueries: {
        page: page,
        perPage: 5,
      },
      queryParams: {},
    };

    if (user?.role === "Delivery_Person" || user?.role === "Admin") {
      await axiosInstance.post(`/orders/get`, { ...payload }).then((res) => {
        setOrders(res.data.data);
        setHasNextPage(res.data.meta.hasNextPage);
        setHasPrevPage(res.data.meta.hasPreviousPage);
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

  const getCreatedAtDate = (dateData: Date | undefined) => {
    if (!dateData) return "";

    const date = new Date(dateData);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month} ${day} ${year}, ${hours}:${minutes}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 px-4 lg:px-16 xl:px-24 bg-gray-50 py-10 min-h-screen flex justify-center"
    >
      <div className="max-w-7xl w-full space-y-6">
        {/* Header */}
        <h2 className="text-4xl font-semibold text-[#1A3F6B] text-center mb-8">Order Management</h2>

        {/* Orders */}
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="relative flex flex-col p-6 border border-gray-200 bg-white rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(`/order/${order.id}`)}
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <p className="italic text-lg font-medium text-gray-700">
                  Order #{Math.floor(Math.random() * 9999) + 1}
                </p>
                {getOrderStatus(order)}
              </div>
              <hr className="border-gray-300 mb-4" />

              {/* Order Details */}
              <div className="space-y-4">
                <p className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                  <span className="font-semibold text-gray-800">Products: </span>
                  <span className="text-gray-700">{order.orderProduct.length}</span>
                </p>
                <p className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-gray-600" />
                  <span className="font-semibold text-gray-800">Total: </span>
                  <span className="text-gray-700">${order.total.toLocaleString()}</span>
                </p>
                <p className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-gray-600" />
                  <span className="font-semibold text-gray-800">Address: </span>
                  <span className="text-gray-700">
                    {order.address}, {order.city}, {order.zip}
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <CalendarPlus2 className="w-6 h-6 text-gray-600" />
                  <span className="font-semibold text-gray-800">Created at: </span>
                  <span className="text-gray-700">{getCreatedAtDate(order?.createdAt)}</span>
                </p>
                <p className="flex items-center gap-3">
                  <CalendarClock className="w-6 h-6 text-gray-600" />
                  <span className="font-semibold text-gray-800">Preferred Delivery Date: </span>
                  <span className="text-gray-700">{order.prefDeliveryDate}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-end gap-4">
                {(user?.role === "Customer" || user?.role === "Admin") &&
                  !order.isDelivered &&
                  !order.isTaken &&
                  !order.isCanceled && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrderStatusChange("Canceled", order.id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300"
                    >
                      Cancel
                    </button>
                  )}

                {user?.role === "Delivery_Person" &&
                  !order.isDelivered &&
                  !order.isTaken &&
                  !order.isCanceled && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrderStatusChange("Taken", order.id);
                      }}
                      className="bg-[#1A3F6B] hover:bg-[#123456] text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300"
                    >
                      Take Order
                    </button>
                  )}

                {user?.role === "Delivery_Person" &&
                  !order.isDelivered &&
                  order.isTaken &&
                  !order.isCanceled && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrderStatusChange("Delivered", order.id);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300"
                    >
                      Deliver Order
                    </button>
                  )}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <button
            disabled={!hasPrevPage}
            onClick={() => {
              setPage((prevPage) => prevPage - 1);
              window.scroll(0, 0);
            }}
            className="w-28 bg-[#1A3F6B] hover:bg-[#123456] text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300 disabled:bg-gray-200"
          >
            Previous
          </button>

          <button
            disabled={!hasNextPage}
            onClick={() => {
              setPage((prevPage) => prevPage + 1);
              window.scroll(0, 0);
            }}
            className="w-28 bg-[#1A3F6B] hover:bg-[#123456] text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300 disabled:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderManager;
