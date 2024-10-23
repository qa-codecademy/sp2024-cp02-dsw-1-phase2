import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-gray-200 to-gray-100">
      <h1 className="text-8xl font-extrabold text-[#1A3F6B] mb-6 drop-shadow-lg">
        404
      </h1>
      <h2 className="text-4xl font-semibold text-gray-900 mb-4 drop-shadow-md">
        Uh-oh! You're lost.
      </h2>
      <p className="text-lg text-gray-700 mb-4 text-center max-w-lg leading-relaxed">
        Looks like you’ve short-circuited the path and ended up in the digital
        abyss. But hey, even the smartest tech wizards sometimes trip over their
        wires!
      </p>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-lg leading-relaxed">
        Let’s reboot and get you back on track before the internet police start
        thinking you're hacking the matrix! ⚡️💻🔌
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-[#1A3F6B] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white hover:text-[#1A3F6B] hover:shadow-xl border border-transparent hover:border-[#1A3F6B] transition-all duration-300 transform hover:scale-105"
      >
        Take Me Home
      </button>
    </div>
  );
};

export default NotFound;
