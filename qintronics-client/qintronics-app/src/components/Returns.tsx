import { useNavigate } from "react-router-dom";

const Returns = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#F9FAFB]">
      <div className="bg-white p-12 md:p-16 rounded-lg shadow-2xl max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-[#1A3F6B] mb-8 drop-shadow-lg">
          Easy & Hassle-Free Returns
        </h1>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          At Qintronics, your satisfaction is our top priority. If you're not
          100% satisfied with your purchase, don't worry! We’ve made returning
          products as simple as possible.
        </p>

        <div className="text-left text-gray-600 mb-8">
          <h3 className="text-2xl font-semibold text-[#1A3F6B] mb-4">
            Our Return Policy:
          </h3>
          <ul className="list-disc list-inside mb-6 leading-relaxed">
            <li>
              <span className="font-bold">30-Day Returns:</span> You have 30
              days from the date of purchase to return items for a full refund.
            </li>
            <li>
              <span className="font-bold">Condition:</span> Items must be in
              their original packaging and unused or in the same condition as
              you received them.
            </li>
            <li>
              <span className="font-bold">Processing Time:</span> Refunds will
              be processed within 7-10 business days after we receive your
              returned item.
            </li>
            <li>
              <span className="font-bold">Return Shipping:</span> Return
              shipping costs may apply unless the return is due to our error
              (e.g., defective or incorrect item sent).
            </li>
            <li>
              <span className="font-bold">Opened Products:</span> Opened
              electronics may be subject to a restocking fee, depending on the
              condition of the product upon return.
            </li>
            <li>
              <span className="font-bold">Exchanges:</span> Need a different
              product? We also offer easy exchanges. Simply contact our support
              team to get started.
            </li>
          </ul>

          <div className="bg-[#f7f7f7] p-4 rounded-lg shadow-inner">
            <h4 className="font-semibold text-lg text-[#1A3F6B] mb-2">
              Return Process:
            </h4>
            <p className="text-sm leading-relaxed text-gray-600 mb-2">
              <span className="font-bold">1. Contact our support team</span> to
              initiate the return.
            </p>
            <p className="text-sm leading-relaxed text-gray-600 mb-2">
              <span className="font-bold">2. Pack the item securely</span> in
              its original packaging, including all accessories, manuals, and
              documentation.
            </p>
            <p className="text-sm leading-relaxed text-gray-600 mb-2">
              <span className="font-bold">3. Ship the item back to us</span>{" "}
              using the return label provided.
            </p>
            <p className="text-sm leading-relaxed text-gray-600">
              <span className="font-bold">
                4. Receive your refund or exchange
              </span>{" "}
              within 7-10 business days of receiving the item.
            </p>
          </div>
        </div>

        {/* Centered Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-[#1A3F6B] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white hover:text-[#1A3F6B] hover:shadow-xl border border-transparent hover:border-[#1A3F6B] transition-all duration-300 transform hover:scale-105 mb-6"
          >
            Return Home
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Still need help?{" "}
          <span
            onClick={() => navigate("/contact")}
            className="text-[#1A3F6B] font-semibold cursor-pointer hover:underline"
          >
            Contact our Support Team
          </span>
        </p>
      </div>
    </div>
  );
};

export default Returns;
