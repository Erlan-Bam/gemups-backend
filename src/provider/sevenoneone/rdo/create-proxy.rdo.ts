export type CreateProxyRdo =
  | { status: 'success'; order_no: string; username: string; passwd: string }
  | { status: 'error'; order_no: undefined; error: string };
