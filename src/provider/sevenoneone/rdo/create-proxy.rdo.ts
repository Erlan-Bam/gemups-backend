export type CreateProxyRdo =
  | { status: 'success'; order_no: number }
  | { status: 'error'; order_no: undefined };
