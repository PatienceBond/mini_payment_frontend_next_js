"use client";

import { useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";

interface EntityHookOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  showToast?: boolean;
}

export function useEntity<T = any>(endpoint: string, options: EntityHookOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const { onSuccess, onError, showToast = true } = options;

  const create = async (data: Partial<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(endpoint, data);
      const result = response.data;
      
      if (onSuccess) onSuccess(result);
      if (showToast) toast.success("Created successfully!");
      
      return result;
    } catch (err: any) {
      const error = err.response?.data || { message: "Failed to create" };
      setError(error);
      
      if (onError) onError(error);
      if (showToast) toast.error(error.message || "Failed to create");
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: string, data: Partial<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.put(`${endpoint}/${id}`, data);
      const result = response.data;
      
      if (onSuccess) onSuccess(result);
      if (showToast) toast.success("Updated successfully!");
      
      return result;
    } catch (err: any) {
      const error = err.response?.data || { message: "Failed to update" };
      setError(error);
      
      if (onError) onError(error);
      if (showToast) toast.error(error.message || "Failed to update");
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`${endpoint}/${id}`);
      
      if (onSuccess) onSuccess({ id });
      if (showToast) toast.success("Deleted successfully!");
      
      return true;
    } catch (err: any) {
      const error = err.response?.data || { message: "Failed to delete" };
      setError(error);
      
      if (onError) onError(error);
      if (showToast) toast.error(error.message || "Failed to delete");
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getById = async (id: string): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`${endpoint}/${id}`);
      const result = response.data;
      
      if (onSuccess) onSuccess(result);
      
      return result;
    } catch (err: any) {
      const error = err.response?.data || { message: "Failed to fetch" };
      setError(error);
      
      if (onError) onError(error);
      if (showToast && err.response?.status !== 404) {
        toast.error(error.message || "Failed to fetch");
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getAll = async (): Promise<T[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(endpoint);
      const result = response.data;
      
      if (onSuccess) onSuccess(result);
      
      return result;
    } catch (err: any) {
      const error = err.response?.data || { message: "Failed to fetch" };
      setError(error);
      
      if (onError) onError(error);
      if (showToast) toast.error(error.message || "Failed to fetch");
      
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    create,
    update,
    remove,
    getById,
    getAll,
    isLoading,
    error,
  };
}
