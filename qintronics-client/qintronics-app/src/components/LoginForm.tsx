// import { useState } from "react";

// interface LoginFormProps {
//   onForgotPassword: () => void;
// }

// const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessages, setErrorMessages] = useState<string[]>([]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const errors: string[] = [];

//     if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
//       errors.push("Email is not valid.");
//     }
//     if (password.length < 8) {
//       errors.push("Password must be at least 6 characters long.");
//     }

//     if (errors.length > 0) {
//       setErrorMessages(errors);
//       return;
//     }

//     console.log("Logging in with:", email, password);
//   };

//   return (
//     <form className="space-y-4" onSubmit={handleSubmit}>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="w-full px-4 py-2 border rounded-md"
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="w-full px-4 py-2 border rounded-md"
//         required
//       />
//       {errorMessages.length > 0 && (
//         <div className="text-red-500">
//           {errorMessages.map((msg, index) => (
//             <p key={index}>{msg}</p>
//           ))}
//         </div>
//       )}
//       <button
//         type="submit"
//         className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
//       >
//         Login
//       </button>
//       <p className="mt-2 text-right">
//         <button
//           onClick={onForgotPassword}
//           className="text-blue-600 hover:underline"
//         >
//           Forgot Password?
//         </button>
//       </p>
//     </form>
//   );
// };

// export default LoginForm;