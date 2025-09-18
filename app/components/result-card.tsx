"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Copy, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Transaction } from "../../lib/api";

interface ResultCardProps {
  transaction: Transaction;
  onCopyId?: () => void;
  onViewDetails?: () => void;
}

export function ResultCard({ transaction, onCopyId, onViewDetails }: ResultCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
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

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {getStatusIcon(transaction.status)}
              <CardTitle>Transaction Result</CardTitle>
            </div>
            <Badge variant={getStatusVariant(transaction.status) as any}>
              {transaction.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded flex-1">
                    {transaction.transactionId}
                  </p>
                  {onCopyId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onCopyId}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Card Number</label>
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">
                  {transaction.maskedCardNumber}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <p className="text-lg font-semibold text-green-600">
                  {formatAmount(transaction.amount, transaction.currencyCode)}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Processed At</label>
                <p className="text-sm text-muted-foreground">
                  {formatDate(transaction.processedAt)}
                </p>
              </div>
            </div>
          </div>

          {transaction.bankMessage && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Bank Message</label>
              <p className="text-sm bg-muted px-3 py-2 rounded mt-1">
                {transaction.bankMessage}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            {onViewDetails && (
              <Button
                variant="outline"
                onClick={onViewDetails}
                className="flex-1"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Full Details
              </Button>
            )}
            {onCopyId && (
              <Button
                onClick={onCopyId}
                className="sm:w-auto"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Transaction ID
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}