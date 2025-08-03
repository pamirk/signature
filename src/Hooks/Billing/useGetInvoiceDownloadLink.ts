import { useCallback } from 'react';
import axios from 'axios';
import { InvoiceDownloadLink } from 'Interfaces/Billing';

//TODO: Replace with your actual API endpoint and adjust the payload type as needed
export function useGetInvoiceDownloadLink(): [
  (payload: InvoiceDownloadLink) => Promise<any>
] {
  const getInvoiceDownloadLink = useCallback(async (payload: InvoiceDownloadLink) => {
    // Replace with your actual API endpoint
    const response = await axios.post('/api/invoice/download-link', payload);
    return response.data;
  }, []);

  return [getInvoiceDownloadLink];
}