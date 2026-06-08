import axiosClient from "./axiosClient";

export interface PaymentReturnParams {
  code: string;
  id: string;
  cancel: string;
  status: string;
  orderCode: string;
}

export interface PaymentReturnResponse {
  status: string;
  message: string;
  orderCode: number;
  paymentId: string;
}

export const getPaymentReturn = async (
  params: PaymentReturnParams,
): Promise<PaymentReturnResponse> => {
  const response = await axiosClient.get<PaymentReturnResponse>(
    "/payment/return",
    { params },
  );

  return response.data;
};
