import { FormEvent, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button } from './Button';

interface PaymentFormProps {
  clientSecret: string;
  amountSek: number;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

export function PaymentForm({ clientSecret, amountSek, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setPaymentError(error.message ?? 'Payment failed. Please try again.');
        setIsProcessing(false);
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else {
        // Handles requires_action, requires_payment_method, etc.
        setPaymentError(`Payment status: ${paymentIntent?.status ?? 'unknown'}. Please try again.`);
        setIsProcessing(false);
      }
    } catch (err: any) {
      setPaymentError(err?.message ?? 'An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">Payment</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Total: <span className="font-semibold text-gray-800 dark:text-gray-200">{amountSek.toFixed(0)} SEK</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1f2937',
                  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                  '::placeholder': { color: '#9ca3af' },
                },
                invalid: { color: '#ef4444' },
              },
            }}
          />
        </div>

        {paymentError && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md border border-red-200 dark:border-red-800 text-sm">
            {paymentError}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onCancel}
            disabled={isProcessing}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isProcessing}
            disabled={!stripe || isProcessing}
          >
            Pay {amountSek.toFixed(0)} SEK
          </Button>
        </div>
      </form>
    </div>
  );
}
