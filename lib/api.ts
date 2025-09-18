import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface PaymentRequest {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  amount: number;
  currencyCode: string;
}

export interface PaymentResponse {
  transactionId: string;
  status: string;
  message?: string;
}

export interface Transaction {
  transactionId: string;
  maskedCardNumber: string;
  status: string;
  amount: number;
  currencyCode: string;
  bankMessage?: string;
  processedAt: string;
}

export const paymentApi = {
  create: async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    const response = await api.post("/api/payments", paymentData);
    return response.data;
  },

  getById: async (transactionId: string): Promise<Transaction> => {
    const response = await api.get(`/api/payments/${transactionId}`);
    return response.data;
  },

  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get("/api/payments");
    return response.data;
  },
};
