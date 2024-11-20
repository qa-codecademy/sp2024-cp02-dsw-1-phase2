import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../common/utils/axios-instance.util";
import { Order } from "./OrderManager";
import {
  User,
  Mail,
  MapPin,
  ShoppingCart,
  Info,
  CalendarPlus2,
} from "lucide-react";

export default function OrderOverview() {
  const [order, setOrder] = useState<Order>();
  const orderId = useParams().orderId;

  useEffect(() => {
    axiosInstance.get(`/orders/single/${orderId}`).then((res) => {
      setOrder(res.data);
    });
  }, []);

  // Calculate grand total
  const grandTotal = order?.orderProduct.reduce(
    (acc, product) => acc + product.priceAtOrderTime * product.quantity,
    0
  );

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
            <p className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">Name:</span>
              {order?.firstName} {order?.lastName}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">Email:</span>
              {order?.email}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">Address:</span>
              {order?.address}, {order?.city}, {order?.zip}
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#1A3F6B]">
            Order Details
          </h2>
          <div className="space-y-4">
            <p className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">Products:</span>
              {order?.orderProduct.length}
            </p>
            <p className="flex items-center gap-2">
              <CalendarPlus2 className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">Created at:</span>
              {getCreatedAtDate(order?.createdAt)}
            </p>
            <p className="flex items-center gap-2">
              <Info className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">Status:</span>
              <span
                className={`${
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
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-[#1A3F6B] mb-6">
          Ordered Products
        </h1>
        <table className="w-full table-auto border-collapse rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-[#f7f9fc] text-gray-700 text-left">
              <th className="px-6 py-3 text-sm font-bold uppercase">Product</th>
              <th className="px-6 py-3 text-sm font-bold uppercase text-center">
                Quantity
              </th>
              <th className="px-6 py-3 text-sm font-bold uppercase text-center">
                Single Price
              </th>
              <th className="px-6 py-3 text-sm font-bold uppercase text-center">
                Total Price
              </th>
            </tr>
          </thead>
          <tbody>
            {order?.orderProduct.map((product, index) => (
              <tr
                key={product.product.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                } hover:bg-gray-200`}
              >
                <td className="px-6 py-4 flex items-center gap-4">
                  <img
                    src={product.product.img}
                    alt={product.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <span className="text-gray-900 font-medium">
                    {product.product.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-gray-700">
                  {product.quantity}
                </td>
                <td className="px-6 py-4 text-center text-gray-700">
                  ${product.priceAtOrderTime.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center text-gray-700">
                  $
                  {(
                    product.priceAtOrderTime * product.quantity
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-right">
          <p className="text-lg font-bold text-gray-700">
            Grand Total:{" "}
            <span className="text-[#1A3F6B]">
              ${grandTotal?.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
