import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#F9FAFB]">
      <div className="bg-white p-12 md:p-16 rounded-lg shadow-2xl max-w-4xl text-center">
        {/* Centered Title and Intro */}
        <h1 className="text-5xl font-bold text-[#1A3F6B] mb-8 drop-shadow-lg">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          At Qintronics, we value your privacy and are committed to protecting
          the personal information you share with us. This Privacy Policy
          outlines how we collect, use, and safeguard your data when you
          interact with our website.
        </p>

        {/* Information We Collect */}
        <div className="mb-8 text-left">
          <h2 className="text-2xl font-semibold text-[#1A3F6B] mb-4">
            Information We Collect
          </h2>
          <ul className="list-disc list-inside text-gray-600 mb-6 leading-relaxed">
            <li>
              Personal identification information (e.g., name, email address,
              phone number)
            </li>
            <li>
              Payment details (for transactions, note: we do not store your
              payment information)
            </li>
            <li>
              Usage data (how you interact with our website, including pages
              visited, clicks, etc.)
            </li>
          </ul>
        </div>

        {/* How We Use Your Information */}
        <div className="mb-8 text-left">
          <h2 className="text-2xl font-semibold text-[#1A3F6B] mb-4">
            How We Use Your Information
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We use your personal information to process orders, improve your
            shopping experience, and communicate with you. Your information will
            never be sold or shared with third-party organizations without your
            consent, except as required by law.
          </p>
        </div>

        {/* Security of Your Information */}
        <div className="mb-8 text-left">
          <h2 className="text-2xl font-semibold text-[#1A3F6B] mb-4">
            Security of Your Information
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We use industry-standard security measures, such as encryption and
            secure servers, to protect your personal data from unauthorized
            access, disclosure, or misuse. Your privacy and security are our top
            priorities.
          </p>
        </div>

        {/* Your Rights */}
        <div className="mb-8 text-left">
          <h2 className="text-2xl font-semibold text-[#1A3F6B] mb-4">
            Your Rights
          </h2>
          <ul className="list-disc list-inside text-gray-600 mb-6 leading-relaxed">
            <li>You can request access to, update, or delete your data.</li>
            <li>
              You have the right to opt-out of marketing communications at any
              time.
            </li>
            <li>
              We are committed to giving you full control over your personal
              information.
            </li>
          </ul>
        </div>

        {/* Centered Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/")}
            className="bg-[#1A3F6B] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white hover:text-[#1A3F6B] hover:shadow-xl border border-transparent hover:border-[#1A3F6B] transition-all duration-300 transform hover:scale-105"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
