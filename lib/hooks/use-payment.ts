"use client";

import { useState } from "react";
import { paymentApi, PaymentRequest, PaymentResponse, Transaction, ApiError } from "../api";
import toast from "react-hot-toast";

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await paymentApi.create(paymentData);
      toast.success("Payment processed successfully!");
      return response;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error("Payment hook error:", apiError);
      const errorMessage = apiError.message || "Failed to process payment";
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPayment,
    isLoading,
    error,
  };
}

export function useTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const getTransaction = async (transactionId: string): Promise<Transaction | null> => {
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
