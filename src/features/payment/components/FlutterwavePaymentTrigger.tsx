"use client";

import { useEffect } from "react";
import { toast } from "@/store/toast";

interface Props {
  config: any;
  onSuccess: (transactionId: string, txRef: string) => void;
  onClose: () => void;
}

export function FlutterwavePaymentTrigger({ config, onSuccess, onClose }: Props) {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      let attempts = 0;
      while (
        typeof (window as any).FlutterwaveCheckout === "undefined" &&
        attempts < 20
      ) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        attempts++;
      }

      if (cancelled) return;

      if (typeof (window as any).FlutterwaveCheckout === "undefined") {
        toast.error(
          "Payment system failed to load",
          "Please refresh the page and try again.",
        );
        onClose();
        return;
      }

      (window as any).FlutterwaveCheckout({
        public_key: config.public_key,
        tx_ref: config.tx_ref,
        amount: config.amount,
        currency: config.currency || "NGN",
        payment_options: "card,banktransfer,ussd,opay",
        customer: {
          email: config.customer.email,
          name: config.customer.name || "Customer",
          phone_number: config.customer.phone_number || "",
        },
        meta: config.meta,
        customizations: {
          title: config.customizations?.title || "ShopFresherz",
          description:
            config.customizations?.description ||
            "Secure payment for your order",
          logo:
            config.customizations?.logo ||
            "https://shopfresherz.com/favicon.ico",
        },
        callback: function (response: any) {
          const isSuccess =
            response.status === "successful" || response.status === "completed";
          if (isSuccess) {
            onSuccess(String(response.transaction_id), response.tx_ref);
          } else {
            toast.error("Payment was not completed", "Please try again.");
            onClose();
          }
        },
        onclose: function () {
          onClose();
        },
      });
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // renders nothing, just triggers the Flutterwave V4 popup
}
