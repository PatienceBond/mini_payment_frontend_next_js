"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PaymentForm } from "./components/payment-form";
import { TransactionLookup } from "./components/transaction-lookup";
import { ResultCard } from "./components/result-card";
import { usePaymentStore } from "../lib/store/payment-store";
import { Transaction } from "../lib/api";
import toast from "react-hot-toast";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"payment" | "lookup">("payment");
  const [lookupResult, setLookupResult] = useState<Transaction | null>(null);
  const lastTransaction = usePaymentStore((state) => state.lastTransaction);

  const handleCopyTransactionId = (transactionId: string) => {
    navigator.clipboard.writeText(transactionId);
    toast.success("Transaction ID copied to clipboard!");
  };

  const handleViewDetails = () => {
    if (lastTransaction) {
      setLookupResult(lastTransaction);
      setActiveTab("lookup");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Mini Payment Gateway
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Process payments and manage transactions with our secure and modern payment gateway interface.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-muted p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("payment")}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                activeTab === "payment"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Process Payment
            </button>
            <button
              onClick={() => setActiveTab("lookup")}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                activeTab === "lookup"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Lookup Transaction
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentForm />
            </motion.div>
          )}

          {activeTab === "lookup" && (
            <motion.div
              key="lookup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TransactionLookup />
            </motion.div>
          )}
        </div>

        {/* Last Transaction Quick Access */}
        {lastTransaction && activeTab === "payment" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto mt-8"
          >
            <ResultCard
              transaction={lastTransaction}
              onCopyId={() => handleCopyTransactionId(lastTransaction.transactionId)}
              onViewDetails={handleViewDetails}
            />
          </motion.div>
        )}

      </div>
    </div>
  );
}