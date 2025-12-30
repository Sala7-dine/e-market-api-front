// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../config/axios";

const PaymentModal = ({ isOpen, onClose, onSuccess, cartId, total, couponCode }) => {
  const queryClient = useQueryClient();
  const [paymentStep, setPaymentStep] = useState("payment"); // payment, processing, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const createOrderMutation = useMutation({
    mutationFn: async ({ cartId, couponCode }) => {
      const payload = couponCode ? { couponCode } : {};
      const res = await axios.post(`/orders/addOrder/${cartId}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      queryClient.refetchQueries(["cart"]);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Payment failed";
      setErrorMessage(message);
      setPaymentStep("error");
    },
  });

  const handlePayment = async () => {
    setPaymentStep("processing");

    try {
      await createOrderMutation.mutateAsync({ cartId, couponCode });

      // Simulate payment processing
      setTimeout(() => {
        setPaymentStep("success");
      }, 2000);
    } catch (error) {
      // Error is handled by onError callback
      console.error("Payment failed:", error);
    }
  };

  const handleClose = useCallback(() => {
    setPaymentStep("payment");
    setErrorMessage("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setPaymentStep("payment");
      setErrorMessage("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (paymentStep === "success") {
      setTimeout(() => {
        if (onSuccess) onSuccess();
        handleClose();
      }, 3000);
    }
  }, [paymentStep, onSuccess, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        {paymentStep === "payment" && (
          <>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment</h2>
              <p className="text-gray-600">Complete your order</p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-2xl font-bold text-[#FF6B6B]">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={createOrderMutation.isPending}
              className="w-full bg-[#FF6B6B] text-white py-3 rounded-full font-medium hover:bg-[#ff5252] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pay Now
            </button>
          </>
        )}

        {paymentStep === "processing" && (
          <div className="text-center py-8">
            <div className="animate-spin w-16 h-16 border-4 border-[#FF6B6B] border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Payment...</h2>
            <p className="text-gray-600">Please wait while we process your payment</p>
          </div>
        )}

        {paymentStep === "success" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600">Your order has been placed successfully</p>
          </div>
        )}

        {paymentStep === "error" && (
          <>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-red-600 mb-2">Payment Failed</h2>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <button
                onClick={() => setPaymentStep("payment")}
                className="bg-[#FF6B6B] text-white py-2 px-6 rounded-full font-medium hover:bg-[#ff5252] transition-colors"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
