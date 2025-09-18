"use client";

import { useState } from "react";
import {
  paymentApi,
  PaymentRequest,
  PaymentResponse,
  Transaction,
  ApiError,
} from "../api";
import toast from "react-hot-toast";

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const createPayment = async (
    paymentData: PaymentRequest,
    retryAttempt = 0
  ): Promise<PaymentResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await paymentApi.create(paymentData);

      // Check if the transaction was successful or failed
      if (response.status === "Success") {
        toast.success("Payment processed successfully!");
      } else {
        toast.error("Payment failed - transaction declined");
      }

      setRetryCount(0); // Reset retry count on success
      return response;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error("Payment hook error:", apiError);

      // Auto-retry for network errors (up to 2 retries)
      if (
        retryAttempt < 2 &&
        (apiError.code === "ECONNREFUSED" ||
          apiError.code === "ENOTFOUND" ||
          apiError.code === "ECONNABORTED")
      ) {
        setRetryCount(retryAttempt + 1);
        toast.error(`Connection failed. Retrying... (${retryAttempt + 1}/2)`);

        // Wait 1 second before retry
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return createPayment(paymentData, retryAttempt + 1);
      }

      const errorMessage = apiError.message || "Failed to process payment";
      toast.error(errorMessage);
      setRetryCount(0);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const retryPayment = () => {
    if (error && retryCount < 2) {
      // This would need the original payment data to retry
      // For now, we'll just clear the error
      setError(null);
      setRetryCount(0);
    }
  };

  return {
    createPayment,
    retryPayment,
    isLoading,
    error,
    retryCount,
  };
}

export function useTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const getTransaction = async (
    transactionId: string
  ): Promise<Transaction | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await paymentApi.getById(transactionId);
      return response;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError);
      if (apiError.status === 404) {
        toast.error("Transaction not found");
      } else {
        toast.error(apiError.message || "Failed to fetch transaction");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getTransaction,
    isLoading,
    error,
  };
}

export function useTransactions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async (): Promise<Transaction[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await paymentApi.getAll();
      setTransactions(response);
      return response;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError);
      toast.error(apiError.message || "Failed to fetch transactions");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transactions,
    fetchTransactions,
    isLoading,
    error,
  };
}
