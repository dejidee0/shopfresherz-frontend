import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useEffect } from "react";

interface Props {
  config: any;
  onSuccess: (transactionId: string, txRef: string) => void;
  onClose: () => void;
}

export function FlutterwavePaymentTrigger({ config, onSuccess, onClose }: Props) {
  const handleFlutterPayment = useFlutterwave(config);

  useEffect(() => {
    handleFlutterPayment({
      callback: (response) => {
  closePaymentModal();
  const isSuccess =
    response.status === "successful" ||
      response.status === "completed";
    // response.status === "completed" ||
    // response.chargeResponseCode === "00";

  if (isSuccess) {
    onSuccess(String(response.transaction_id), response.tx_ref);
  } else {
    onClose();
  }
},
      onClose,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null; // renders nothing, just triggers popup
}