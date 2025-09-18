"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  CreditCard,
  Calendar,
  DollarSign,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTransaction } from "../../lib/hooks/use-payment";
import { Transaction } from "../../lib/api";

const schema = yup.object({
  transactionId: yup
    .string()
    .required("Transaction ID is required")
    .min(1, "Transaction ID cannot be empty"),
});

interface TransactionLookupForm {
  transactionId: string;
}

export function TransactionLookup() {
  const { getTransaction, isLoading, error } = useTransaction();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [notFound, setNotFound] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionLookupForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: TransactionLookupForm) => {
    setNotFound(false);
    setTransaction(null);

    const result = await getTransaction(data.transactionId);
    if (result) {
      setTransaction(result);
    } else {
      setNotFound(true);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
      case "completed":
        return "success";
      case "failed":
      case "error":
        return "destructive";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            <CardTitle>Transaction Lookup</CardTitle>
          </div>
          <CardDescription>
            Enter a transaction ID to view its details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                {...register("transactionId")}
                id="transactionId"
                placeholder="Enter transaction ID"
                className={errors.transactionId ? "border-destructive" : ""}
              />
              {errors.transactionId && (
                <div className="text-sm text-destructive">
                  {errors.transactionId.message}
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
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

          {notFound && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-semibold">Transaction not found</h3>
              </div>
              <div className="text-sm text-red-600 mt-1">
                The transaction ID you entered could not be found in our system.
              </div>
            </motion.div>
          )}

          {error && !notFound && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-semibold">Lookup Error</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="bg-red-100 p-3 rounded border-l-4 border-red-400">
                  <div className="font-medium text-red-800 mb-1">
                    Error Message:
                  </div>
                  <div className="text-red-700">{error.message}</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {error.status && (
                    <Badge variant="outline" className="text-xs">
                      Status: {error.status}
                    </Badge>
                  )}
                  {error.code && (
                    <Badge variant="outline" className="text-xs">
                      Code: {error.code}
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-red-600 mt-2">
                  💡 <strong>Tip:</strong> Please check your internet connection
                  and try again.
                </div>
              </div>
            </motion.div>
          )}

          {transaction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-muted/50 border rounded-lg"
            >
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Transaction Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Transaction ID
                    </Label>
                    <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {transaction.transactionId}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Card Number
                    </Label>
                    <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {transaction.maskedCardNumber}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Status
                    </Label>
                    <div className="mt-1">
                      <Badge
                        variant={getStatusVariant(transaction.status) as any}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Amount
                    </Label>
                    <div className="text-lg font-semibold flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {transaction.amount} {transaction.currencyCode}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Processed At
                    </Label>
                    <div className="text-sm flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(transaction.processedAt)}
                    </div>
                  </div>

                  {transaction.bankMessage && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Bank Message
                      </Label>
                      <div className="text-sm bg-muted px-2 py-1 rounded">
                        {transaction.bankMessage}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
