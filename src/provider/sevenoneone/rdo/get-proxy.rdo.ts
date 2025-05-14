export type GetProxyRdo = {
  status: 'success' | 'error';
  code?: number; // Status code
  msg?: string; // Information message
  error?: string; // Error message

  username?: string; // Username
  passwd?: string; // Password
  host?: string; // Custom host
  port?: string; // Port
  proto?: string; // Protocol (e.g., http, https, socks5)

  expire?: string; // Expired timestamp

  un?: string; // Spliced user:passwd@host:port

  order_flow?: string; // Order set allocated traffic, Bytes
  order_flow_after?: string; // After order allocation, remaining traffic
  order_flow_befor?: string; // Before order allocation, remaining traffic

  order_no?: string; // Order number
  restitution_no?: string; // Return order associated order number

  un_flow?: string; // user:pass remaining traffic
  un_flow_used?: string; // user:pass used traffic
  un_status?: boolean; // user:pass status (true/false)
};
