"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Calendar, DollarSign, Copy, Check } from "lucide-react";
import { paymentApi, Transaction } from "@/lib/api";
import toast from "react-hot-toast";

interface LookupForm {
  transactionId: string;
}

export function PaymentLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LookupForm>();

  const onSubmit = async (data: LookupForm) => {
    setIsLoading(true);
    setTransaction(null);

    try {
      const result = await paymentApi.getById(data.transactionId);
      setTransaction(result);
    } catch (error: any) {
      toast.error(error.message || "Transaction not found");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      toast.success("Transaction ID copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "failed":
      case "error":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Search className="h-5 w-5 text-primary" />
          Lookup Payment
        </CardTitle>
        <CardDescription className="text-base">
          Enter a transaction ID to view detailed payment information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="transactionId" className="text-sm font-medium">
              Transaction ID
            </Label>
            <Input
              {...register("transactionId", { required: "Transaction ID is required" })}
              placeholder="Enter transaction ID"
              className={`${errors.transactionId ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.transactionId && (
              <p className="text-sm text-destructive mt-1">{errors.transactionId.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} variant="blue" className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Lookup Transaction
              </>
            )}
          </Button>
        </form>

        {transaction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-gradient-to-br from-muted/30 to-muted/50 border-2 rounded-xl"
          >
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <motion.div
                className="w-3 h-3 bg-blue-600 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              />
              Transaction Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Transaction ID</Label>
                  <div className="mt-1 flex items-start gap-2">
                    <code className="text-sm bg-background px-3 py-2 rounded border font-mono break-all flex-1 leading-relaxed">
                      {transaction.transactionId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(transaction.transactionId)}
                      className="p-2 hover:bg-muted rounded transition-colors flex-shrink-0"
                      title="Copy transaction ID"
                    >
                      {copiedId === transaction.transactionId ? (
                        <Check className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Card Number</Label>
                  <div className="mt-1">
                    <code className="text-sm bg-background px-3 py-2 rounded border font-mono">
                      {transaction.maskedCardNumber}
                    </code>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-2">
                    <Badge className={`${getStatusColor(transaction.status)} px-3 py-1 transition-colors`}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xl font-bold">
                      {transaction.amount} {transaction.currencyCode}
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Processed At</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(transaction.processedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {transaction.bankMessage && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Bank Message</Label>
                    <div className="mt-1">
                      <p className="text-sm bg-background px-3 py-2 rounded border">
                        {transaction.bankMessage}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}