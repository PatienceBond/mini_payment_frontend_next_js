"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentForm } from "@/components/payment-form";
import { PaymentLookup } from "@/components/payment-lookup";
import { PaymentsList } from "@/components/payments-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Search, List } from "lucide-react";

type ActiveView = "create" | "lookup" | "list";

export default function HomePage() {
  const [activeView, setActiveView] = useState<ActiveView>("create");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create payments, lookup transactions, and view payment history
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="flex justify-center mb-6 sm:mb-8 px-2 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-muted/50 p-1 rounded-xl flex flex-col sm:inline-flex sm:flex-row border-2 border-muted w-full max-w-md sm:max-w-none sm:w-auto">
            <Button
              variant={activeView === "create" ? "blue" : "ghost"}
              onClick={() => setActiveView("create")}
              className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-3 sm:py-2 relative w-full sm:w-auto text-sm sm:text-base"
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden xs:inline">Create Payment</span>
              <span className="xs:hidden">Create</span>
              {activeView === "create" && (
                <motion.div
                  className="absolute inset-0 bg-blue-600 rounded-lg -z-10"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Button>
            <Button
              variant={activeView === "lookup" ? "blue" : "ghost"}
              onClick={() => setActiveView("lookup")}
              className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-3 sm:py-2 relative w-full sm:w-auto text-sm sm:text-base"
            >
              <Search className="h-4 w-4" />
              <span className="hidden xs:inline">Lookup Payment</span>
              <span className="xs:hidden">Lookup</span>
              {activeView === "lookup" && (
                <motion.div
                  className="absolute inset-0 bg-blue-600 rounded-lg -z-10"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Button>
            <Button
              variant={activeView === "list" ? "blue" : "ghost"}
              onClick={() => setActiveView("list")}
              className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-3 sm:py-2 relative w-full sm:w-auto text-sm sm:text-base"
            >
              <List className="h-4 w-4" />
              <span className="hidden xs:inline">All Payments</span>
              <span className="xs:hidden">All</span>
              {activeView === "list" && (
                <motion.div
                  className="absolute inset-0 bg-blue-600 rounded-lg -z-10"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeView === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <PaymentForm />
              </motion.div>
            )}
            {activeView === "lookup" && (
              <motion.div
                key="lookup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <PaymentLookup />
              </motion.div>
            )}
            {activeView === "list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <PaymentsList />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
