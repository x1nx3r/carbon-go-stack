import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { ShowcaseService } from "@/gen/erp/showcase/v1/showcase_pb";

// The browser talks to the BFF on the same origin. Cookies stay in the
// browser; no CORS, no token in JavaScript.
const transport = createConnectTransport({
  baseUrl: "/api",
  useBinaryFormat: true,
});

export const showcaseClient = createClient(ShowcaseService, transport);
