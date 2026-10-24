import { Code, ConnectError } from "@connectrpc/connect";
import { connectNodeAdapter } from "@connectrpc/connect-node";
import { createServer } from "node:http";
import {
  CustomerStatus,
  CustomersService,
} from "../src/gen/erp/customers/v1/customers_pb";

type Customer = {
  id: string;
  name: string;
  email: string;
  status: CustomerStatus;
  balanceMinor: bigint;
  currency: string;
  createdAt: string;
};

const money = (units: number) => BigInt(units * 100);

const customers: Customer[] = [
  { id: "cus_001", name: "Northwind Supply", email: "ap@northwind.example", status: CustomerStatus.ACTIVE, balanceMinor: money(12_450), currency: "USD", createdAt: "2026-01-12T09:12:00Z" },
  { id: "cus_002", name: "Sagara Retail", email: "finance@sagara.example", status: CustomerStatus.ACTIVE, balanceMinor: money(3_180), currency: "IDR", createdAt: "2026-01-18T03:45:00Z" },
  { id: "cus_003", name: "Kite & Co", email: "billing@kite.example", status: CustomerStatus.ON_HOLD, balanceMinor: money(0), currency: "USD", createdAt: "2026-02-02T11:30:00Z" },
  { id: "cus_004", name: "Meridian Grocers", email: "ap@meridian.example", status: CustomerStatus.ACTIVE, balanceMinor: money(8_920), currency: "GBP", createdAt: "2026-02-11T14:05:00Z" },
  { id: "cus_005", name: "Blue Harbor Logistics", email: "accounts@blueharbor.example", status: CustomerStatus.ARCHIVED, balanceMinor: money(0), currency: "USD", createdAt: "2025-11-27T08:00:00Z" },
  { id: "cus_006", name: "Tani Makmur", email: "owner@tanimakmur.example", status: CustomerStatus.ACTIVE, balanceMinor: money(1_450), currency: "IDR", createdAt: "2026-03-01T02:20:00Z" },
  { id: "cus_007", name: "Lumen Studio", email: "hello@lumen.example", status: CustomerStatus.ACTIVE, balanceMinor: money(420), currency: "EUR", createdAt: "2026-03-14T16:40:00Z" },
  { id: "cus_008", name: "Harbor Point Cafe", email: "manager@harborpoint.example", status: CustomerStatus.ON_HOLD, balanceMinor: money(2_100), currency: "USD", createdAt: "2026-03-22T10:15:00Z" },
  { id: "cus_009", name: "Sentosa Pharmacy", email: "ap@sentosa.example", status: CustomerStatus.ACTIVE, balanceMinor: money(760), currency: "IDR", createdAt: "2026-04-05T06:55:00Z" },
  { id: "cus_010", name: "Cedar & Vine", email: "accounts@cedarvine.example", status: CustomerStatus.ACTIVE, balanceMinor: money(5_600), currency: "USD", createdAt: "2026-04-19T12:10:00Z" },
  { id: "cus_011", name: "Atlas Components", email: "finance@atlas.example", status: CustomerStatus.ACTIVE, balanceMinor: money(18_300), currency: "USD", createdAt: "2026-05-02T09:05:00Z" },
  { id: "cus_012", name: "Padi Jaya", email: "admin@padijaya.example", status: CustomerStatus.ARCHIVED, balanceMinor: money(0), currency: "IDR", createdAt: "2025-12-08T04:30:00Z" },
  { id: "cus_013", name: "Ridgeway Parts", email: "ap@ridgeway.example", status: CustomerStatus.ACTIVE, balanceMinor: money(7_240), currency: "GBP", createdAt: "2026-05-21T15:20:00Z" },
  { id: "cus_014", name: "Kopi Tepi Jalan", email: "owner@kopitepi.example", status: CustomerStatus.ACTIVE, balanceMinor: money(1_020), currency: "IDR", createdAt: "2026-06-01T01:45:00Z" },
  { id: "cus_015", name: "Sino Trading", email: "billing@sinotrading.example", status: CustomerStatus.ACTIVE, balanceMinor: money(24_900), currency: "USD", createdAt: "2026-06-17T07:35:00Z" },
  { id: "cus_016", name: "Fjord Design", email: "invoice@fjord.example", status: CustomerStatus.ON_HOLD, balanceMinor: money(3_300), currency: "EUR", createdAt: "2026-06-29T13:00:00Z" },
  { id: "cus_017", name: "Matahari Textiles", email: "ap@matahari.example", status: CustomerStatus.ACTIVE, balanceMinor: money(6_780), currency: "IDR", createdAt: "2026-07-03T05:25:00Z" },
  { id: "cus_018", name: "Greyline Services", email: "finance@greyline.example", status: CustomerStatus.ACTIVE, balanceMinor: money(2_450), currency: "USD", createdAt: "2026-07-19T11:55:00Z" },
  { id: "cus_019", name: "Bumi Sejahtera", email: "owner@bumisejahtera.example", status: CustomerStatus.ACTIVE, balanceMinor: money(9_100), currency: "IDR", createdAt: "2026-08-08T03:10:00Z" },
  { id: "cus_020", name: "Kingsway Hardware", email: "ap@kingsway.example", status: CustomerStatus.ARCHIVED, balanceMinor: money(0), currency: "GBP", createdAt: "2026-01-30T10:40:00Z" },
  { id: "cus_021", name: "Orchard Bakes", email: "hello@orchardbakes.example", status: CustomerStatus.ACTIVE, balanceMinor: money(890), currency: "USD", createdAt: "2026-08-22T08:15:00Z" },
  { id: "cus_022", name: "Delta Marine", email: "accounts@deltamarine.example", status: CustomerStatus.ACTIVE, balanceMinor: money(13_600), currency: "USD", createdAt: "2026-09-04T14:50:00Z" },
  { id: "cus_023", name: "Warung Sederhana", email: "owner@warung.example", status: CustomerStatus.ON_HOLD, balanceMinor: money(310), currency: "IDR", createdAt: "2026-09-21T02:05:00Z" },
];

const handler = connectNodeAdapter({
  routes(router) {
    router.service(CustomersService, {
      listCustomers(request) {
        const query = request.query.trim().toLowerCase();
        const matches = query
          ? customers.filter(
              (customer) =>
                customer.name.toLowerCase().includes(query) ||
                customer.email.toLowerCase().includes(query),
            )
          : customers;
        const page = request.page > 0 ? request.page : 1;
        const pageSize =
          request.pageSize > 0 ? Math.min(request.pageSize, 100) : 20;
        const start = (page - 1) * pageSize;
        // Match the backend: newest first, id ascending as the tie-breaker.
        const sorted = [...matches].sort(
          (a, b) =>
            b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id),
        );

        return {
          customers: sorted.slice(start, start + pageSize),
          total: sorted.length,
        };
      },

      getCustomer(request) {
        const customer = customers.find((item) => item.id === request.id);
        if (!customer) {
          throw new ConnectError(`Customer ${request.id} not found`, Code.NotFound);
        }
        return { customer };
      },

      updateCustomer(request) {
        const customer = customers.find((item) => item.id === request.id);
        if (!customer) {
          throw new ConnectError(`Customer ${request.id} not found`, Code.NotFound);
        }
        const name = request.name.trim();
        const email = request.email.trim();
        if (!name) {
          throw new ConnectError("Name is required", Code.InvalidArgument);
        }
        if (!email.includes("@")) {
          throw new ConnectError("A valid email is required", Code.InvalidArgument);
        }
        customer.name = name;
        customer.email = email;
        if (request.currency) customer.currency = request.currency;
        return { customer };
      },

      deleteCustomer(request) {
        const index = customers.findIndex((item) => item.id === request.id);
        if (index === -1) {
          throw new ConnectError(`Customer ${request.id} not found`, Code.NotFound);
        }
        customers.splice(index, 1);
        return {};
      },

      createCustomer(request) {
        const name = request.name.trim();
        const email = request.email.trim();
        if (!name) {
          throw new ConnectError("Name is required", Code.InvalidArgument);
        }
        if (!email.includes("@")) {
          throw new ConnectError("A valid email is required", Code.InvalidArgument);
        }

        const customer: Customer = {
          id: `cus_${Date.now().toString(36)}`,
          name,
          email,
          status: CustomerStatus.ACTIVE,
          balanceMinor: BigInt(0),
          currency: request.currency || "USD",
          createdAt: new Date().toISOString(),
        };
        customers.unshift(customer);
        return { customer };
      },
    });
  },
});

createServer(handler).listen(4010, "127.0.0.1", () => {
  console.log("mock CustomersService on http://127.0.0.1:4010");
});
