import { useState } from 'react';
import { LtdCheckoutUpgradeResponse } from 'Interfaces/Billing';

interface UpgradeCheckoutParams {
  ltdId: string;
  successUrl: string;
  cancelUrl: string;
}

//TODO: Replace with your actual API response type
export function usePaymentCheckoutUpgrade(): [
  (params: UpgradeCheckoutParams) => Promise<LtdCheckoutUpgradeResponse | undefined>,
  boolean
] {
  const [loading, setLoading] = useState(false);

  const upgradeLtdPaymentCheckout = async (
    params: UpgradeCheckoutParams
  ): Promise<LtdCheckoutUpgradeResponse | null> => {
    setLoading(true);
    try {
      // Replace with your actual API call
      const response = await fetch('/api/ltd/upgrade-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) return null;
      const data = await response.json();
      return data as LtdCheckoutUpgradeResponse;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  };

  return [upgradeLtdPaymentCheckout, loading];
}

export default usePaymentCheckoutUpgrade;