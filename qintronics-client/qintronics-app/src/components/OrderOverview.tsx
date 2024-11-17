import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../common/utils/axios-instance.util";
import { Order } from "./OrderManager";
import {
  User,
  Mail,
  MapPin,
  ShoppingCart,
  DollarSign,
  Info,
} from "lucide-react";

export default function OrderOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [order, setOrder] = useState<Order>();
  const orderId = useParams().orderId;

  const payload = {
    paginationQueries: {
      page: 1,
      perPage: 10,
    },
    queryParams: {
      userMail: order?.email,
    },
  };

  useEffect(() => {
    axiosInstance.post(`/orders/get`, payload).then((res) => {
      setOrders(res.data.data);
    });
  }, []);

  useEffect(() => {
    setOrder(orders.find((order: Order) => order.id === orderId));
  }, [orders]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-[#1A3F6B] mb-8">
        Order Overview
      </h1>

      {/* Customer & Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Customer Details */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#1A3F6B]">
            Customer Details
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User size={18} className="text-gray-500" />
              <p className="font-medium text-gray-700">Name:</p>
              <p className="text-gray-900">
                {order?.firstName} {order?.lastName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-gray-500" />
              <p className="font-medium text-gray-700">Email:</p>
              <p className="text-gray-900">{order?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-gray-500" />
              <p className="font-medium text-gray-700">Address:</p>
              <p className="text-gray-900">
                {order?.address}, {order?.city}, {order?.zip}
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#1A3F6B]">
            Order Details
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} className="text-gray-500" />
              <p className="font-medium text-gray-700">Products:</p>
              <p className="text-gray-900">{order?.orderProduct.length}</p>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-gray-500" />
              <p className="font-medium text-gray-700">Total:</p>
              <p className="text-gray-900">${order?.total.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <Info size={18} className="text-gray-500" />
              <p className="font-medium text-gray-700">Status:</p>
              <p
                className={`text-lg font-semibold ${
                  order?.isCanceled
                    ? "text-red-600"
                    : order?.isDelivered
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {order?.isCanceled
                  ? "Canceled"
                  : order?.isDelivered
                  ? "Delivered"
                  : order?.isPaid
                  ? "Paid"
                  : order?.isTaken
                  ? "Taken"
                  : "Unpaid"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-[#1A3F6B] mb-6">
          Ordered Products
        </h1>
        <div className="divide-y divide-gray-200">
          {order?.orderProduct.map((product) => (
            <div
              key={product.product.id}
              className="flex items-center justify-between py-4"
            >
              {/* Product Image and Details */}
              <div className="flex items-center gap-4">
                <img
                  src={product.product.img}
                  alt={product.product.name}
                  className="w-16 h-16 object-cover rounded-md border border-gray-200"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.product.name}
                  </h3>
                  {/* Quantity below product name */}
                  <p className="text-sm font-medium text-gray-700 mt-1">
                    Quantity:{" "}
                    <span className="text-[#1A3F6B] font-semibold">
                      {product.quantity}
                    </span>
                  </p>
                  {/* Single Price */}
                  <p className="text-sm font-medium text-gray-700">
                    Single Price:{" "}
                    <span className="text-[#1A3F6B] font-bold">
                      ${product.priceAtOrderTime.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>

              {/* Total Price */}
              <p className="text-md font-medium text-gray-700">
                Total:{" "}
                <span className="text-[#1A3F6B] font-bold">
                  ${product.priceAtOrderTime * product.quantity}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
