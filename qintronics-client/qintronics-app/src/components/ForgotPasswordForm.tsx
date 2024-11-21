import { useState } from "react";

interface ForgotPasswordFormProps {
  onClose: () => void;
  onEmailSent: (email: string) => void; // Callback to notify that the reset email has been sent
}

const ForgotPasswordForm = ({
  onClose,
  onEmailSent,
}: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation for email
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrorMessage("Please enter a valid email.");
      return;
    }

    // Clear previous errors and trigger the onEmailSent callback
    setErrorMessage(null);
    setSuccessMessage("An email has been sent to reset your password.");
    onEmailSent(email);

    // Simulate email sent (in a real app, call the API here)
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 3000); // Simulate delay before closing
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          {/* Display error or success messages */}
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          {successMessage && (
            <div className="text-green-500">{successMessage}</div>
          )}

          <button
            type="submit"
            className="w-full bg-[#1A3F6] text-white py-2 rounded-md hover:bg-[#1A3F6]/65 transition-colors duration-300"
          >
            Send Reset Link
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 text-blue-600 hover:underline text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
