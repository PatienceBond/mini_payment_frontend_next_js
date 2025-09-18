"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Loader2 } from "lucide-react";
import { paymentApi, PaymentRequest } from "@/lib/api";
import toast from "react-hot-toast";

export function PaymentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PaymentRequest>();

  const onSubmit = async (data: PaymentRequest) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await paymentApi.create(data);
      setResult(response);

      // Check if the transaction was successful or failed
      if (response.status === "Success") {
        toast.success("Payment processed successfully!");
      } else {
        toast.error("Payment failed - transaction declined");
      }
      reset();
    } catch (error: any) {
      toast.error(error.message || "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoData = () => {
    // Generate random card number with mix of odd/even endings
    const baseCardNumber = "411111111111111";
    const randomLastDigit = Math.floor(Math.random() * 10); // 0-9 for mix of odd/even
    const cardNumber = baseCardNumber + randomLastDigit;

    setValue("cardNumber", cardNumber);
    setValue("expiryMonth", 12);
    setValue("expiryYear", 2025);
    setValue("cvv", "123");
    setValue("amount", 100);
    setValue("currencyCode", "USD");
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-xl">
          <CreditCard className="h-5 w-5 text-primary" />
          Create Payment
        </CardTitle>
        <CardDescription className="text-base">
          Enter payment details to process a secure transaction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cardNumber" className="text-sm font-medium">
              Card Number
            </Label>
            <Input
              {...register("cardNumber", { required: "Card number is required" })}
              placeholder="1234 5678 9012 3456"
              maxLength={16}
              className={`${errors.cardNumber ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.cardNumber && (
              <p className="text-sm text-destructive mt-1">{errors.cardNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Expiry Month</Label>
              <Select onValueChange={(value) => setValue("expiryMonth", parseInt(value))}>
                <SelectTrigger className={errors.expiryMonth ? "border-destructive" : ""}>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {String(i + 1).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Expiry Year</Label>
              <Select onValueChange={(value) => setValue("expiryYear", parseInt(value))}>
                <SelectTrigger className={errors.expiryYear ? "border-destructive" : ""}>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv" className="text-sm font-medium">
                CVV
              </Label>
              <Input
                {...register("cvv", { required: "CVV is required" })}
                placeholder="123"
                maxLength={4}
                className={`${errors.cvv ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount
              </Label>
              <Input
                {...register("amount", { required: "Amount is required", valueAsNumber: true })}
                type="number"
                step="0.01"
                placeholder="0.00"
                className={`${errors.amount ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              {errors.amount && (
                <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Currency</Label>
              <Select onValueChange={(value) => setValue("currencyCode", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="MWK">MWK - Malawian Kwacha</SelectItem>
                  <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} variant="blue" className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Payment"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={fillDemoData}>
              Fill Demo
            </Button>
          </div>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`p-6 border-2 rounded-xl mt-6 ${
              result.status === "Success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <h3 className={`font-semibold mb-4 flex items-center gap-2 ${
              result.status === "Success" ? "text-green-700" : "text-red-700"
            }`}>
              <motion.div
                className={`w-3 h-3 rounded-full ${
                  result.status === "Success" ? "bg-green-500" : "bg-red-500"
                }`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              />
              {result.status === "Success" ? "Payment Successful!" : "Payment Failed!"}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transaction ID:</span>
                <code className={`text-xs px-3 py-2 rounded-lg border ${
                  result.status === "Success"
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}>{result.transactionId}</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="secondary" className={
                  result.status === "Success"
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-red-100 text-red-800 border-red-300"
                }>
                  {result.status}
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}