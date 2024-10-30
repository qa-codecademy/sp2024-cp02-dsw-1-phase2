import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../common/utils/axios-instance.util";
import { Order } from "./OrderManager";

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
      userMail: "customer@example.com",
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
    <div className="m-16 text-[#1f2937]">
      <h1 className="text-2xl text-center font-semibold">Order Overview</h1>

      <div className="flex flex-col md:flex-row justify-around items-center ">
        <div className="flex flex-col items-center gap-2 mt-4 shadow-lg px-10 py-6 rounded-xl w-[300px] hover:scale-105 transition-transform duration-200">
          <h2 className="font-bold text-xl">Customer Details</h2>

          <hr className="w-full" />

          <div className="flex flex-col items-center">
            <p className="font-semibold">Name:</p>
            <p>
              {order?.firstName} {order?.lastName}
            </p>
          </div>

          <hr className="w-full" />

          <div className="flex flex-col items-center">
            <p className="font-semibold">Email:</p>
            <p>{order?.email}</p>
          </div>

          <hr className="w-full" />

          <div className="flex flex-col items-center">
            <p className="font-semibold">Address:</p>
            <p>
              {order?.address}, {order?.city}, {order?.zip}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 mt-4 shadow-lg px-10 py-6 rounded-xl w-[300px] hover:scale-105 transition-transform duration-200">
          <h2 className="font-bold text-xl">Order Details</h2>

          <hr className="w-full" />

          <div className="flex flex-col items-center">
            <p className="font-semibold">Products:</p>
            <p>{order?.orderProduct.length}</p>
          </div>

          <hr className="w-full" />

          <div className="flex flex-col items-center">
            <p className="font-semibold">Total:</p>
            <p>${order?.total.toLocaleString()}</p>
          </div>

          <hr className="w-full" />

          <div className="flex flex-col items-center">
            <p className="font-semibold">Status:</p>
            <p>
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

      <h1 className="text-2xl text-center font-semibold mt-6">Products</h1>

      {order?.orderProduct.map((product) => (
        <div className="flex gap-2 mt-4 shadow-lg px-10 py-6 rounded-xl w-full hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center gap-10 w-full">
            <div className="flex items-center gap-10">
              <img
                src={product.product.img}
                alt={product.product.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold text-[#1f2937]">{product.product.name}</h3>
            </div>
            <div className="flex gap-10">
              <p className="font-semibold">x {product.quantity}</p>
              <p className="font-semibold">${product.priceAtOrderTime.toLocaleString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
