import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../config/axios';

const PaymentModal = ({ isOpen, onClose, onSuccess, cartId, total }) => {
  const queryClient = useQueryClient();
  const [paymentStep, setPaymentStep] = useState('payment'); // payment, processing, success
  
  const createOrderMutation = useMutation({
    mutationFn: async (cartId) => {
      const res = await axios.post(`/orders/addOrder/${cartId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      queryClient.refetchQueries(['cart']);
    }
  });

  const handlePayment = async () => {
    setPaymentStep('processing');
    
    try {
      await createOrderMutation.mutateAsync(cartId);
      
      // Simulate payment processing
      setTimeout(() => {
        setPaymentStep('success');
      }, 2000);
    } catch (error) {
      setPaymentStep('payment');
      console.error('Payment failed:', error);
    }
  };

  const handleClose = () => {
    setPaymentStep('payment');
    onClose();
  };

  useEffect(() => {
    if (paymentStep === 'success') {
      setTimeout(() => {
        if (onSuccess) onSuccess();
        handleClose();
      }, 3000);
    }
  }, [paymentStep, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        
        {paymentStep === 'payment' && (
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
              className="w-full bg-[#FF6B6B] text-white py-3 rounded-full font-medium hover:bg-[#ff5252] transition-colors disabled:opacity-50"
            >
              Pay Now
            </button>
          </>
        )}

        {paymentStep === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin w-16 h-16 border-4 border-[#FF6B6B] border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Payment...</h2>
            <p className="text-gray-600">Please wait while we process your payment</p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600">Your order has been placed successfully</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;