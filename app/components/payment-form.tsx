"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Zap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { usePayment } from "../../lib/hooks/use-payment";
import { usePaymentStore } from "../../lib/store/payment-store";
import { PaymentRequest } from "../../lib/api";

const schema = yup.object({
  cardNumber: yup
    .string()
    .required("Card number is required")
    .matches(/^\d{16}$/, "Card number must be 16 digits"),
  expiryMonth: yup
    .number()
    .required("Expiry month is required")
    .min(1, "Invalid month")
    .max(12, "Invalid month"),
  expiryYear: yup
    .number()
    .required("Expiry year is required")
    .min(new Date().getFullYear(), "Year must be in the future"),
  cvv: yup
    .string()
    .required("CVV is required")
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .min(0.01, "Amount must be at least 0.01"),
  currencyCode: yup.string().required("Currency is required"),
});

const currencies = [
  { value: "MWK", label: "Malawian Kwacha (MWK)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "ZAR", label: "South African Rand (ZAR)" },
];

const months = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1).padStart(2, "0"),
  label: String(i + 1).padStart(2, "0"),
}));

const years = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() + i;
  return { value: String(year), label: String(year) };
});

const demoData: Partial<PaymentRequest> = {
  cardNumber: "4111111111111112",
  expiryMonth: 12,
  expiryYear: 2025,
  cvv: "123",
  amount: 100.00,
  currencyCode: "USD",
};

export function PaymentForm() {
  const { createPayment, isLoading, error } = usePayment();
  const setLastTransaction = usePaymentStore((state) => state.setLastTransaction);
  const [result, setResult] = useState<any>(null);
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<PaymentRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      currencyCode: "USD",
    },
  });

  const onSubmit = async (data: PaymentRequest) => {
    setIsError(false);
    setResult(null);
    
    const response = await createPayment(data);
    if (response) {
      setResult(response);
      setIsError(false);
      // Store the transaction for quick lookup
      setLastTransaction({
        transactionId: response.transactionId,
        maskedCardNumber: `**** **** **** ${data.cardNumber.slice(-4)}`,
        status: response.status,
        amount: data.amount,
        currencyCode: data.currencyCode,
        processedAt: new Date().toISOString(),
      });
    } else {
      setIsError(true);
    }
  };

  const fillDemoData = () => {
    Object.entries(demoData).forEach(([key, value]) => {
      setValue(key as keyof PaymentRequest, value as any);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <CardTitle>Payment Form</CardTitle>
          </div>
          <CardDescription>
            Enter your payment details to process a transaction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  {...register("cardNumber")}
                  id="cardNumber"
                  placeholder="1234567890123456"
                  maxLength={16}
                  className={errors.cardNumber ? "border-destructive" : ""}
                />
                {errors.cardNumber && (
                  <div className="text-sm text-destructive">{errors.cardNumber.message}</div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonth">Month</Label>
                  <Select onValueChange={(value) => setValue("expiryMonth", parseInt(value))}>
                    <SelectTrigger className={errors.expiryMonth ? "border-destructive" : ""}>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.expiryMonth && (
                    <div className="text-sm text-destructive">{errors.expiryMonth.message}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiryYear">Year</Label>
                  <Select onValueChange={(value) => setValue("expiryYear", parseInt(value))}>
                    <SelectTrigger className={errors.expiryYear ? "border-destructive" : ""}>
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.expiryYear && (
                    <div className="text-sm text-destructive">{errors.expiryYear.message}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  {...register("cvv")}
                  id="cvv"
                  placeholder="123"
                  maxLength={4}
                  className={errors.cvv ? "border-destructive" : ""}
                />
                {errors.cvv && (
                  <div className="text-sm text-destructive">{errors.cvv.message}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currencyCode">Currency</Label>
                <Select onValueChange={(value) => setValue("currencyCode", value)}>
                  <SelectTrigger className={errors.currencyCode ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currencyCode && (
                  <div className="text-sm text-destructive">{errors.currencyCode.message}</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                {...register("amount", { valueAsNumber: true })}
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className={errors.amount ? "border-destructive" : ""}
              />
              {errors.amount && (
                <div className="text-sm text-destructive">{errors.amount.message}</div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Process Payment
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={fillDemoData}
                className="sm:w-auto"
              >
                Fill Demo Data
              </Button>
            </div>
          </form>

          {result && !isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <h3 className="font-semibold text-green-700 mb-2">
                Payment Successful!
              </h3>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Transaction ID:</span> {result.transactionId}
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <Badge variant="success">{result.status}</Badge>
                </div>
              </div>
            </motion.div>
          )}

          {isError && error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <h3 className="font-semibold text-red-700 mb-2">
                Payment Failed!
              </h3>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Error:</span> {error.message}
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <Badge variant="destructive">Failed</Badge>
                </div>
                {error.status && (
                  <div>
                    <span className="font-medium">Status Code:</span> {error.status}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}