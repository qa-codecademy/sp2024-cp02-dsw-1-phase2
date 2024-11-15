// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Product } from "../common/types/Product-interface";
// import fetchProducts from "../common/utils/fetchProducts";
// import { useNavigate } from "react-router-dom";

// const SliderDiv = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchProducts({ random: true, pageSize: 8 });
//         setProducts(data.products);
//       } catch (error: any) {
//         setError(error.message);
//         console.error("Error fetching products data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProducts();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [products.length]);

//   const handleDotClick = (index: number) => {
//     setCurrentIndex(index);
//   };

//   const navigate = useNavigate();

//   const handleNavigateClick = (id: string) => {
//     navigate(`/products/${id}`);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[70vh]">
//         <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-[70vh] text-red-500">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-w-[100%] min-h-[500px] bg-[#f5f5f7] rounded-3xl overflow-hidden mx-auto ">
//       <AnimatePresence initial={false}>
//         {products.length > 0 && (
//           <motion.div
//             key={currentIndex}
//             className="absolute inset-0 flex"
//             initial={{ x: "100%", opacity: 0.5 }}
//             animate={{
//               x: "0%",
//               opacity: 1,
//               transition: { duration: 1.2, ease: "easeOut" },
//             }}
//             exit={{
//               x: "-100%",
//               opacity: 0,
//               transition: { duration: 1.2, ease: "easeInOut" },
//             }}
//           >
//             <div
//               className="relative w-full h-full cursor-pointer group"
//               onClick={() => handleNavigateClick(products[currentIndex].id)}
//             >
//               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
//               <img
//                 src={products[currentIndex].img}
//                 alt={products[currentIndex].name}
//                 className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
//               />
//               <motion.div
//                 className="absolute inset-0 flex flex-col justify-end p-8 text-white"
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
//               >
//                 {/* Minimalistic Name */}
//                 <h2 className="text-3xl font-semibold mb-3">
//                   {products[currentIndex].name}
//                 </h2>
//                 {/* Minimalistic Description */}
//                 <p className="text-lg mb-4 max-w-2xl text-opacity-80">
//                   {products[currentIndex].description}
//                 </p>
//                 <div className="flex items-center space-x-6">
//                   {/* Minimalistic Price */}
//                   <span className="text-2xl font-medium text-opacity-90">
//                     ${products[currentIndex].price}
//                   </span>
//                   <motion.button
//                     whileHover={{ scale: 1.03 }}
//                     whileTap={{ scale: 0.97 }}
//                     className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-opacity-90 transition-colors"
//                   >
//                     Check Now
//                   </motion.button>
//                 </div>
//               </motion.div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
//         {products.map((_, index) => (
//           <button
//             key={index}
//             className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
//               index === currentIndex
//                 ? "bg-white w-8"
//                 : "bg-white/50 hover:bg-white/70"
//             }`}
//             onClick={() => handleDotClick(index)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SliderDiv;
