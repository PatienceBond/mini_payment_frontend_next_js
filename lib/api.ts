import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    return Promise.reject(error);
  }
);

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

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// Payment API functions
export const paymentApi = {
  // Create a new payment
  create: async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    try {
      console.log("Sending payment data:", paymentData);
      const response = await api.post("/api/payments", paymentData);
      console.log("Payment response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Payment creation error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to process payment";
      throw {
        message: errorMessage,
        status: error.response?.status,
        details: error.response?.data
      } as ApiError;
    }
  },

  // Get a specific transaction by ID
  getById: async (transactionId: string): Promise<Transaction> => {
    try {
      const response = await api.get(`/api/payments/${transactionId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw {
          message: "Transaction not found",
          status: 404,
        } as ApiError;
      }
      throw {
        message: error.response?.data?.message || "Failed to fetch transaction",
        status: error.response?.status,
      } as ApiError;
    }
  },

  // Get all transactions
  getAll: async (): Promise<Transaction[]> => {
    try {
      const response = await api.get("/api/payments");
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || "Failed to fetch transactions",
        status: error.response?.status,
      } as ApiError;
    }
  },
};
