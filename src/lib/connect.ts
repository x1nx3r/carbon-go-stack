import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { CustomersService } from "@/gen/erp/customers/v1/customers_pb";

// The browser talks to the BFF on the same origin. Cookies stay in the
// browser; no CORS, no token in JavaScript.
const transport = createConnectTransport({
  baseUrl: "/api",
  useBinaryFormat: true,
});

export const customersClient = createClient(CustomersService, transport);
