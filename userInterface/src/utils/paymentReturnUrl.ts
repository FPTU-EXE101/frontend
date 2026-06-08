export const PAYMENT_SUCCESS_PATH = "/payment/success";

export const getPaymentSuccessUrl = (
  origin: string = window.location.origin,
): string => {
  return `${origin}${PAYMENT_SUCCESS_PATH}`;
};

export const convertBackendPaymentReturnToFrontendUrl = (
  backendReturnUrl: string,
  origin: string = window.location.origin,
): string => {
  const url = new URL(backendReturnUrl);
  return `${getPaymentSuccessUrl(origin)}${url.search}`;
};
